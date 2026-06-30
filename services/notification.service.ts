import { AppError } from "@/lib/api/errors";
import {
  buildIncidentAnalyzedPayload,
  buildIncidentCreatedPayload,
} from "@/lib/n8n/events";
import {
  renderIncidentAnalyzedEmail,
  renderIncidentCreatedEmail,
} from "@/lib/email/templates";
import { emailService } from "@/services/email.service";
import { n8nService } from "@/services/n8n.service";
import type { N8nStatus } from "@/lib/n8n/types";

export type NotificationChannel = "email" | "n8n";

export type NotificationStatus = {
  email: ReturnType<typeof emailService.getStatus>;
  n8n: N8nStatus;
  availableChannels: NotificationChannel[];
};

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

function getAvailableChannels(): NotificationChannel[] {
  const channels: NotificationChannel[] = [];

  if (emailService.isConfigured()) {
    channels.push("email");
  }

  if (n8nService.isConfigured()) {
    channels.push("n8n");
  }

  return channels;
}

export const notificationService = {
  getStatus(): NotificationStatus {
    return {
      email: emailService.getStatus(),
      n8n: n8nService.getStatus(),
      availableChannels: getAvailableChannels(),
    };
  },

  resolveChannels(requested?: NotificationChannel[]): NotificationChannel[] {
    const available = getAvailableChannels();

    if (!requested || requested.length === 0) {
      return available;
    }

    return requested.filter((channel) => available.includes(channel));
  },

  async send(input: SendNotificationInput) {
    const channels = input.channels ?? getAvailableChannels();

    if (channels.length === 0) {
      return { skipped: true, reason: "no_channels_configured" as const };
    }

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
    if (!payload) {
      throw new AppError("n8n payload is required.", 400, "NOTIFICATION_INVALID");
    }

    const result = await n8nService.trigger(payload.event, payload.payload);
    return { delivered: result.delivered, status: result.status };
  },

  async notifyIncidentCreated(
    incident: {
      id: string;
      title: string;
      description: string;
      location?: string | null;
      recipientEmail: string;
    },
    options?: { channels?: NotificationChannel[] }
  ) {
    const channels = this.resolveChannels(options?.channels ?? ["email", "n8n"]);

    if (channels.length === 0) {
      return { skipped: true, reason: "no_channels_configured" as const };
    }

    const rendered = renderIncidentCreatedEmail({
      incidentId: incident.id,
      title: incident.title,
      location: incident.location,
      description: incident.description,
    });

    return this.send({
      channels,
      email: channels.includes("email")
        ? {
            to: incident.recipientEmail,
            subject: rendered.subject,
            html: rendered.html,
            text: rendered.text,
          }
        : undefined,
      n8n: channels.includes("n8n")
        ? {
            event: "incident.created",
            payload: buildIncidentCreatedPayload({
              id: incident.id,
              title: incident.title,
              description: incident.description,
              location: incident.location,
            }),
          }
        : undefined,
    });
  },

  async notifyIncidentAnalyzed(
    incident: {
      id: string;
      title: string;
      severity?: string | null;
      category?: string | null;
      summary?: string | null;
      recommendedAction?: string | null;
      recipientEmail: string;
    },
    options?: { channels?: NotificationChannel[] }
  ) {
    const channels = this.resolveChannels(options?.channels ?? ["email", "n8n"]);

    if (channels.length === 0) {
      return { skipped: true, reason: "no_channels_configured" as const };
    }

    const rendered = renderIncidentAnalyzedEmail({
      incidentId: incident.id,
      title: incident.title,
      category: incident.category,
      severity: incident.severity,
      summary: incident.summary,
      recommendedAction: incident.recommendedAction,
    });

    return this.send({
      channels,
      email: channels.includes("email")
        ? {
            to: incident.recipientEmail,
            subject: rendered.subject,
            html: rendered.html,
            text: rendered.text,
          }
        : undefined,
      n8n: channels.includes("n8n")
        ? {
            event: "incident.analyzed",
            payload: buildIncidentAnalyzedPayload({
              id: incident.id,
              title: incident.title,
              category: incident.category,
              severity: incident.severity,
              summary: incident.summary,
              recommendedAction: incident.recommendedAction,
            }),
          }
        : undefined,
    });
  },

  async sendTestEmail(recipientEmail: string, recipientName?: string) {
    if (!emailService.isConfigured()) {
      return { skipped: true, reason: "email_not_configured" as const };
    }

    return emailService.sendTemplate({
      to: recipientEmail,
      templateId: "system.test",
      context: { recipientName },
    });
  },
};
