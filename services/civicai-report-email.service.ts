import { generateCivicReportPdfBuffer } from "@/lib/civicai/generate-pdf";
import { getAppName } from "@/lib/civicai/brand";
import { mapDbReport, type DbCitizenReportRow } from "@/lib/civicai/map-db-report";
import { renderCivicReportReadyEmail } from "@/lib/email/templates";
import { civicaiPersistence } from "@/services/civicai-persistence.service";
import { emailService } from "@/services/email.service";

function getReportUrl(reportId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/reports/${reportId}`;
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
      const rendered = renderCivicReportReadyEmail({
        recipientName: profile.full_name ?? undefined,
        serviceName: report.serviceName,
        department: report.department,
        fee: report.fee,
        processingTime: report.processingTime,
        summary: report.summary ?? row.summary,
        reportUrl: getReportUrl(row.id),
        officeCity: report.officeLocation?.city,
        appName: getAppName(),
      });

      await emailService.send({
        to: profile.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        attachments: [
          {
            filename: `civicai-${report.serviceId}-${row.id.slice(0, 8)}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (process.env.NODE_ENV === "development") {
        console.info(`[civicai-email] Report email sent to ${profile.email}`);
      }
    } catch (error) {
      console.error("[civicai-email] Failed to send report email:", error);
    }
  },
};
