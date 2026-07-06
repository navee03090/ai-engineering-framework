import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import type { AgentResult } from "@/agents/types";
import type { Json } from "@/types/database";

export const civicaiPersistence = {
  async createRequest(userId: string, query: string, language: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("citizen_requests")
      .insert({
        user_id: userId,
        query,
        language,
        status: "processing",
      })
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "REQUEST_CREATE_FAILED");
    }
    return data;
  },

  async updateRequest(
    id: string,
    patch: {
      detected_intent?: string;
      service_slug?: string;
      confidence?: number;
      status?: string;
      pipeline_result?: Json;
    }
  ) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("citizen_requests")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "REQUEST_UPDATE_FAILED");
    }
    return data;
  },

  async createVerification(
    userId: string,
    serviceSlug: string,
    fileName: string,
    mimeType: string
  ) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("document_verifications")
      .insert({
        user_id: userId,
        service_slug: serviceSlug,
        file_name: fileName,
        mime_type: mimeType,
        status: "processing",
      })
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "VERIFICATION_CREATE_FAILED");
    }
    return data;
  },

  async updateVerification(
    id: string,
    patch: {
      storage_path?: string;
      ocr_result?: Json;
      compliance_result?: Json;
      confidence?: number;
      status?: string;
    }
  ) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("document_verifications")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "VERIFICATION_UPDATE_FAILED");
    }
    return data;
  },

  async getUserProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }
    return data;
  },

  async createReport(input: {
    userId: string;
    requestId?: string;
    verificationId?: string;
    serviceSlug?: string;
    summary: string;
    reportJson: Json;
    qrData?: string;
  }) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("citizen_reports")
      .insert({
        user_id: input.userId,
        request_id: input.requestId ?? null,
        verification_id: input.verificationId ?? null,
        service_slug: input.serviceSlug ?? null,
        summary: input.summary,
        report_json: input.reportJson,
        qr_data: input.qrData ?? null,
      })
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "REPORT_CREATE_FAILED");
    }
    return data;
  },

  async logAgentRun(input: {
    userId: string;
    parentType: "request" | "verification";
    parentId: string;
    agentName: string;
    agentResult: AgentResult<unknown>;
  }) {
    const supabase = await createClient();
    await supabase.from("agent_runs").insert({
      user_id: input.userId,
      parent_type: input.parentType,
      parent_id: input.parentId,
      agent_name: input.agentName,
      output: input.agentResult.data as never,
      success: input.agentResult.success,
      duration_ms: input.agentResult.metadata?.durationMs ?? null,
    });
  },

  async listRequests(userId: string, limit = 20) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("citizen_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new AppError(error.message, 500, "REQUEST_LIST_FAILED");
    }
    return data ?? [];
  },

  async getReport(userId: string, reportId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("citizen_reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new AppError(error.message, 404, "REPORT_NOT_FOUND");
    }
    return data;
  },

  async getStats(userId: string) {
    const supabase = await createClient();
    const [requests, verifications, reports] = await Promise.all([
      supabase
        .from("citizen_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("document_verifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("citizen_reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    return {
      totalRequests: requests.count ?? 0,
      totalVerifications: verifications.count ?? 0,
      totalReports: reports.count ?? 0,
    };
  },

  async uploadDocument(userId: string, file: File): Promise<string> {
    const supabase = await createClient();
    const path = `${userId}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("civicai-documents")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      throw new AppError(error.message, 500, "DOCUMENT_UPLOAD_FAILED");
    }
    return path;
  },

  async updateProfileLanguage(userId: string, language: string) {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({ preferred_language: language })
      .eq("id", userId);
  },
};
