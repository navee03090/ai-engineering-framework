import { AppError } from "@/lib/api/errors";
import { emailService } from "@/services/email.service";

export type NotificationChannel = "email" | "n8n";

export type SendNotificationInput = {
  channels?: NotificationChannel[];
  email?: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  };
  n8n?: {
    event: string;
    payload: Record<string, unknown>;
  };
};

export const notificationService = {
  async send(input: SendNotificationInput) {
    const channels = input.channels ?? ["email"];
    const results: Record<string, unknown> = {};

    if (channels.includes("email")) {
      if (!input.email) {
        throw new AppError("Email payload is required for email channel.", 400, "NOTIFICATION_INVALID");
      }

      results.email = await emailService.send(input.email);
    }

    if (channels.includes("n8n")) {
      results.n8n = await this.triggerN8n(input.n8n);
    }

    return results;
  },

  async triggerN8n(
    payload?: SendNotificationInput["n8n"]
  ): Promise<{ delivered: boolean; status?: number }> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new AppError("N8N_WEBHOOK_URL is not configured.", 503, "N8N_UNAVAILABLE");
    }

    if (!payload) {
      throw new AppError("n8n payload is required.", 400, "NOTIFICATION_INVALID");
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: payload.event,
        payload: payload.payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new AppError("n8n webhook call failed.", 502, "N8N_WEBHOOK_FAILED", {
        status: response.status,
      });
    }

    return { delivered: true, status: response.status };
  },

  async notifyIncidentAnalyzed(incident: {
    id: string;
    title: string;
    severity?: string | null;
    category?: string | null;
    recipientEmail: string;
  }) {
    if (!emailService.isConfigured()) {
      return { skipped: true, reason: "email_not_configured" };
    }

    return this.send({
      channels: ["email"],
      email: {
        to: incident.recipientEmail,
        subject: `[AEF] Incident analyzed: ${incident.title}`,
        html: `<p>Incident <strong>${incident.title}</strong> was analyzed.</p>
<p>Category: ${incident.category ?? "n/a"}<br/>Severity: ${incident.severity ?? "n/a"}</p>`,
        text: `Incident ${incident.title} analyzed. Category: ${incident.category ?? "n/a"}. Severity: ${incident.severity ?? "n/a"}.`,
      },
    });
  },
};
