import { AppError } from "@/lib/api/errors";
import {
  renderIncidentAnalyzedEmail,
  renderIncidentCreatedEmail,
} from "@/lib/email/templates";
import { emailService } from "@/services/email.service";

export type NotificationChannel = "email";

export type NotificationStatus = {
  email: ReturnType<typeof emailService.getStatus>;
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
};

function getAvailableChannels(): NotificationChannel[] {
  return emailService.isConfigured() ? ["email"] : [];
}

export const notificationService = {
  getStatus(): NotificationStatus {
    return {
      email: emailService.getStatus(),
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

    if (!channels.includes("email")) {
      return { skipped: true, reason: "no_channels_configured" as const };
    }

    if (!input.email) {
      throw new AppError("Email payload is required for email channel.", 400, "NOTIFICATION_INVALID");
    }

    const email = await emailService.send(input.email);
    return { email };
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
    const channels = this.resolveChannels(options?.channels ?? ["email"]);

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
      email: {
        to: incident.recipientEmail,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      },
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
    const channels = this.resolveChannels(options?.channels ?? ["email"]);

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
      email: {
        to: incident.recipientEmail,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      },
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
