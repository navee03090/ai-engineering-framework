import { AppError } from "@/lib/api/errors";
import {
  buildAttachmentUploadedPayload,
  buildIncidentAnalyzedPayload,
  buildIncidentCreatedPayload,
  buildTestPayload,
  deliverN8nWebhook,
  N8N_EVENT_CATALOG,
  N8N_EVENT_NAMES,
} from "@/lib/n8n";
import type { N8nEventName, N8nStatus, N8nWebhookResult } from "@/lib/n8n";

export const n8nService = {
  isConfigured(): boolean {
    return Boolean(process.env.N8N_WEBHOOK_URL);
  },

  getStatus(): N8nStatus {
    return {
      configured: this.isConfigured(),
      webhookUrl: process.env.N8N_WEBHOOK_URL ?? null,
      hasSecret: Boolean(process.env.N8N_WEBHOOK_SECRET),
      events: [...N8N_EVENT_NAMES],
    };
  },

  getEventCatalog() {
    return N8N_EVENT_CATALOG;
  },

  async trigger(
    event: N8nEventName | string,
    payload: Record<string, unknown>
  ): Promise<N8nWebhookResult> {
    if (!this.isConfigured()) {
      throw new AppError("N8N_WEBHOOK_URL is not configured.", 503, "N8N_UNAVAILABLE");
    }

    return deliverN8nWebhook(event, payload);
  },

  async triggerOrSkip(
    event: N8nEventName | string,
    payload: Record<string, unknown>
  ): Promise<N8nWebhookResult | { skipped: true; reason: "n8n_not_configured" }> {
    if (!this.isConfigured()) {
      return { skipped: true, reason: "n8n_not_configured" };
    }

    return deliverN8nWebhook(event, payload);
  },

  async sendTestEvent(triggeredBy: string) {
    return this.triggerOrSkip("system.test", buildTestPayload(triggeredBy));
  },

  async notifyIncidentCreated(incident: {
    id: string;
    title: string;
    description: string;
    location?: string | null;
  }) {
    return this.triggerOrSkip(
      "incident.created",
      buildIncidentCreatedPayload(incident)
    );
  },

  async notifyIncidentAnalyzed(incident: {
    id: string;
    title: string;
    category?: string | null;
    severity?: string | null;
    summary?: string | null;
    recommendedAction?: string | null;
  }) {
    return this.triggerOrSkip(
      "incident.analyzed",
      buildIncidentAnalyzedPayload(incident)
    );
  },

  async notifyAttachmentUploaded(attachment: {
    incidentId: string;
    attachmentId: string;
    fileName: string;
    mimeType: string;
    category: string;
    fileSize: number;
  }) {
    return this.triggerOrSkip(
      "incident.attachment.uploaded",
      buildAttachmentUploadedPayload(attachment)
    );
  },
};
