import { createAdminClient } from "@/lib/supabase/admin";
import { AppError } from "@/lib/api/errors";
import { getFileCategory, validateUploadFile } from "@/lib/validations/uploads";
import type { CreateIncidentInput } from "@/lib/validations/incidents";
import { getActiveCivicPack } from "@/lib/civic/config";
import { isEscalationSeverity } from "@/lib/civic/severity";
import { attachmentService } from "@/services/attachment.service";
import { incidentService } from "@/services/incident.service";
import { notificationService } from "@/services/notification.service";
import { n8nService } from "@/services/n8n.service";

export const civicService = {
  getBranding() {
    return getActiveCivicPack();
  },

  async submitPublicReport(input: CreateIncidentInput, file?: File) {
    const incident = await incidentService.create(input);

    if (file) {
      await this.attachPublicEvidence(incident.id, file);
    }

    return incident;
  },

  async attachPublicEvidence(incidentId: string, file: File) {
    try {
      validateUploadFile(file);
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : "Invalid file",
        400,
        "UPLOAD_VALIDATION_FAILED"
      );
    }

    const admin = createAdminClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `civic-public/${incidentId}/${Date.now()}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from("uploads")
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new AppError(uploadError.message, 500, "STORAGE_UPLOAD_FAILED");
    }

    const { error: insertError } = await admin.from("incident_attachments").insert({
      incident_id: incidentId,
      uploader_id: null,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      category: getFileCategory(file.type),
    });

    if (insertError) {
      throw new AppError(insertError.message, 500, "ATTACHMENT_CREATE_FAILED");
    }

    try {
      await n8nService.notifyAttachmentUploaded({
        incidentId,
        attachmentId: incidentId,
        fileName: file.name,
        mimeType: file.type,
        category: getFileCategory(file.type),
        fileSize: file.size,
      });
    } catch {
      // Best-effort automation hook.
    }
  },

  async analyzeWithEscalation(incidentId: string, alertEmail?: string | null) {
    const { incident, pipeline } = await incidentService.analyzeAndPersist(incidentId);

    let escalated = false;
    let escalation: Record<string, unknown> = { skipped: true, reason: "below_threshold" };

    if (isEscalationSeverity(incident.severity)) {
      const recipient =
        alertEmail ??
        process.env.CIVIC_ALERT_EMAIL ??
        null;

      if (recipient) {
        try {
          escalation = await notificationService.notifyIncidentAnalyzed({
            id: incident.id,
            title: incident.title,
            severity: incident.severity,
            category: incident.category,
            summary: incident.ai_summary,
            recommendedAction: incident.recommended_action,
            recipientEmail: recipient,
          });
          escalated = true;
        } catch {
          escalation = { skipped: true, reason: "notification_failed" };
        }
      } else {
        try {
          escalation = await n8nService.notifyIncidentAnalyzed({
            id: incident.id,
            title: incident.title,
            category: incident.category,
            severity: incident.severity,
            summary: incident.ai_summary,
            recommendedAction: incident.recommended_action,
          });
          escalated = Boolean(
            escalation && typeof escalation === "object" && !("skipped" in escalation)
          );
        } catch {
          escalation = { skipped: true, reason: "n8n_failed" };
        }
      }
    }

    return {
      incident,
      pipeline,
      escalated,
      escalation,
    };
  },

  listAttachments(incidentId: string) {
    return attachmentService.listByIncident(incidentId);
  },
};
