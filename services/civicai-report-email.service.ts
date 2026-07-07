import { generateCivicReportPdfBuffer } from "@/lib/civicai/generate-pdf";
import { getAppName } from "@/lib/civicai/brand";
import { mapDbReport, type DbCitizenReportRow } from "@/lib/civicai/map-db-report";
import { getAuthorityNotificationEmails } from "@/lib/auth/authority";
import {
  renderCivicReportAuthorityEmail,
  renderCivicReportReadyEmail,
} from "@/lib/email/templates";
import { civicaiPersistence } from "@/services/civicai-persistence.service";
import { emailService } from "@/services/email.service";

function getAppBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function getCitizenReportUrl(reportId: string): string {
  return `${getAppBaseUrl()}/reports/${reportId}`;
}

function getAuthorityReportUrl(reportId: string): string {
  return `${getAppBaseUrl()}/authority/reports/${reportId}`;
}

function getPdfFilename(report: { serviceId: string }, reportId: string): string {
  return `ecomind-${report.serviceId}-${reportId.slice(0, 8)}.pdf`;
}

export const civicaiReportEmailService = {
  async sendReportReadyEmail(userId: string, row: DbCitizenReportRow): Promise<void> {
    if (!emailService.isConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.info(
          "[civicai-email] Skipped — RESEND_API_KEY or RESEND_FROM_EMAIL not set"
        );
      }
      return;
    }

    try {
      const profile = await civicaiPersistence.getUserProfile(userId);
      if (!profile?.email) {
        console.warn("[civicai-email] No profile email for user", userId);
        return;
      }

      const report = mapDbReport(row);
      const pdfBuffer = generateCivicReportPdfBuffer(report);
      const pdfAttachment = {
        filename: getPdfFilename(report, row.id),
        content: pdfBuffer,
      };

      const rendered = renderCivicReportReadyEmail({
        recipientName: profile.full_name ?? undefined,
        serviceName: report.serviceName,
        department: report.department,
        fee: report.fee,
        processingTime: report.processingTime,
        summary: report.summary ?? row.summary,
        reportUrl: getCitizenReportUrl(row.id),
        officeCity: report.officeLocation?.city,
        appName: getAppName(),
      });

      await emailService.send({
        to: profile.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        attachments: [pdfAttachment],
      });

      if (process.env.NODE_ENV === "development") {
        console.info(`[civicai-email] Report email sent to citizen ${profile.email}`);
      }

      await this.sendAuthorityReportNotification({
        row,
        report,
        pdfBuffer,
        citizenEmail: profile.email,
        citizenName: profile.full_name ?? undefined,
      });
    } catch (error) {
      console.error("[civicai-email] Failed to send report email:", error);
    }
  },

  async sendAuthorityReportNotification(input: {
    row: DbCitizenReportRow;
    report: ReturnType<typeof mapDbReport>;
    pdfBuffer: Buffer;
    citizenEmail: string;
    citizenName?: string;
  }): Promise<void> {
    if (!emailService.isConfigured()) {
      return;
    }

    const recipients = getAuthorityNotificationEmails();
    if (recipients.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.info(
          "[civicai-email] Authority notification skipped — set AUTHORITY_EMAIL_ALLOWLIST or CIVIC_ALERT_EMAIL"
        );
      }
      return;
    }

    try {
      const { row, report, pdfBuffer, citizenEmail, citizenName } = input;
      const rendered = renderCivicReportAuthorityEmail({
        serviceName: report.serviceName,
        department: report.department,
        summary: report.summary ?? row.summary,
        citizenEmail,
        citizenName,
        reportUrl: getCitizenReportUrl(row.id),
        authorityReportUrl: getAuthorityReportUrl(row.id),
        confidence: report.confidence,
        appName: getAppName(),
      });

      await emailService.send({
        to: recipients,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        attachments: [
          {
            filename: getPdfFilename(report, row.id),
            content: pdfBuffer,
          },
        ],
      });

      if (process.env.NODE_ENV === "development") {
        console.info(
          `[civicai-email] Authority notification sent to ${recipients.join(", ")}`
        );
      }
    } catch (error) {
      console.error("[civicai-email] Failed to send authority notification:", error);
    }
  },
};
