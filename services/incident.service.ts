import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import type { Database } from "@/types/database";
import type { CreateIncidentInput, UpdateIncidentAiInput } from "@/lib/validations/incidents";
import { aiService } from "@/services/ai.service";

type IncidentRow = Database["public"]["Tables"]["incidents"]["Row"];

export const incidentService = {
  async list(limit = 20): Promise<IncidentRow[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new AppError(error.message, 500, "INCIDENT_LIST_FAILED");
    }

    return data ?? [];
  },

  async getById(id: string): Promise<IncidentRow> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new AppError(error.message, 404, "INCIDENT_NOT_FOUND");
    }

    return data;
  },

  async create(input: CreateIncidentInput, reporterId?: string): Promise<IncidentRow> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("incidents")
      .insert({
        title: input.title,
        description: input.description,
        location: input.location ?? null,
        reporter_id: reporterId ?? null,
        status: "open",
      })
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "INCIDENT_CREATE_FAILED");
    }

    return data;
  },

  async updateAiFields(id: string, input: UpdateIncidentAiInput): Promise<IncidentRow> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("incidents")
      .update({
        category: input.category ?? null,
        severity: input.severity ?? null,
        ai_summary: input.aiSummary ?? null,
        recommended_action: input.recommendedAction ?? null,
        status: input.status ?? "reviewed",
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "INCIDENT_UPDATE_FAILED");
    }

    return data;
  },

  async analyzeAndPersist(id: string) {
    const incident = await this.getById(id);
    const pipeline = await aiService.analyzeIncident(incident.description);

    if (!pipeline.success) {
      throw new AppError("Incident analysis failed", 422, "INCIDENT_ANALYSIS_FAILED", pipeline);
    }

    const classifyStep = pipeline.steps.find((step) => step.agent === "classifier");
    const summarizeStep = pipeline.steps.find((step) => step.agent === "summarizer");

    const classification = classifyStep?.result.data as
      | {
          category?: string;
          severity?: string;
          summary?: string;
          recommendedAction?: string;
        }
      | undefined;

    const summary = summarizeStep?.result.data as { summary?: string } | undefined;

    const updated = await this.updateAiFields(id, {
      category: classification?.category,
      severity: classification?.severity,
      aiSummary: summary?.summary ?? classification?.summary,
      recommendedAction: classification?.recommendedAction,
      status: "reviewed",
    });

    return { incident: updated, pipeline };
  },

  async listSortedByPriority(limit = 50) {
    const incidents = await this.list(limit);
    const { compareSeverity } = await import("@/lib/civic/severity");

    return [...incidents].sort((a, b) => {
      const severityDiff = compareSeverity(a.severity, b.severity);
      if (severityDiff !== 0) {
        return severityDiff;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },

  async getStats() {
    const incidents = await this.list(100);
    const { isEscalationSeverity } = await import("@/lib/civic/severity");

    return {
      total: incidents.length,
      open: incidents.filter((item) => item.status === "open").length,
      reviewed: incidents.filter((item) => item.status === "reviewed").length,
      critical: incidents.filter((item) => isEscalationSeverity(item.severity)).length,
    };
  },
};
