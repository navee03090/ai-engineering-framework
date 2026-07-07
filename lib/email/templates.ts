import type {
  CivicReportAuthorityEmailContext,
  CivicReportReadyEmailContext,
  EmailTemplateId,
  IncidentAnalyzedEmailContext,
  IncidentCreatedEmailContext,
  RenderedEmail,
  TestEmailContext,
} from "@/lib/email/types";
import { getAppName, CIVICAI_PRODUCT_NAME } from "@/lib/civicai/brand";

const appName = () => getAppName();

function layout(content: string, title: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 16px;">${title}</h2>
      ${content}
      <p style="margin-top:24px;font-size:12px;color:#666;">${appName()}</p>
    </div>
  </body>
</html>`;
}

export function renderIncidentAnalyzedEmail(
  context: IncidentAnalyzedEmailContext
): RenderedEmail {
  const name = context.appName ?? appName();
  const subject = `[${name}] Incident analyzed: ${context.title}`;

  const html = layout(
    `<p>Incident <strong>${context.title}</strong> has been analyzed by AI.</p>
<ul>
  <li><strong>ID:</strong> ${context.incidentId}</li>
  <li><strong>Category:</strong> ${context.category ?? "n/a"}</li>
  <li><strong>Severity:</strong> ${context.severity ?? "n/a"}</li>
</ul>
${context.summary ? `<p><strong>Summary:</strong> ${context.summary}</p>` : ""}
${context.recommendedAction ? `<p><strong>Recommended action:</strong> ${context.recommendedAction}</p>` : ""}`,
    "Incident analysis complete"
  );

  const text = `Incident analyzed: ${context.title}
ID: ${context.incidentId}
Category: ${context.category ?? "n/a"}
Severity: ${context.severity ?? "n/a"}
${context.summary ? `Summary: ${context.summary}` : ""}
${context.recommendedAction ? `Action: ${context.recommendedAction}` : ""}`;

  return { subject, html, text };
}

export function renderIncidentCreatedEmail(
  context: IncidentCreatedEmailContext
): RenderedEmail {
  const name = context.appName ?? appName();
  const subject = `[${name}] New incident reported: ${context.title}`;

  const html = layout(
    `<p>A new incident has been submitted.</p>
<ul>
  <li><strong>ID:</strong> ${context.incidentId}</li>
  <li><strong>Title:</strong> ${context.title}</li>
  <li><strong>Location:</strong> ${context.location ?? "n/a"}</li>
</ul>
<p>${context.description}</p>`,
    "New incident reported"
  );

  const text = `New incident: ${context.title}
ID: ${context.incidentId}
Location: ${context.location ?? "n/a"}
${context.description}`;

  return { subject, html, text };
}

export function renderCivicReportReadyEmail(
  context: CivicReportReadyEmailContext
): RenderedEmail {
  const subject = `[${CIVICAI_PRODUCT_NAME}] Your ${context.serviceName} report is ready`;

  const html = layout(
    `<p>Hello${context.recipientName ? ` ${context.recipientName}` : ""},</p>
<p>Your EcoMind AI environmental incident report has been generated.</p>
<ul>
  <li><strong>Issue:</strong> ${context.serviceName}</li>
  <li><strong>Responsible Authority:</strong> ${context.department}</li>
  <li><strong>Estimated Cost:</strong> ${context.fee}</li>
  <li><strong>Estimated Resolution:</strong> ${context.processingTime}</li>
  ${context.officeCity ? `<li><strong>Facility city:</strong> ${context.officeCity}</li>` : ""}
</ul>
<p><strong>Summary:</strong> ${context.summary}</p>
<p>Your full PDF report is attached. You can also view it online:</p>
<p><a href="${context.reportUrl}">${context.reportUrl}</a></p>
<p style="font-size:12px;color:#666;">Mock environmental data for demonstration purposes.</p>`,
    "Your EcoMind AI report is ready"
  );

  const text = `Your EcoMind AI report is ready

Issue: ${context.serviceName}
Authority: ${context.department}
Estimated cost: ${context.fee}
Estimated resolution: ${context.processingTime}
${context.officeCity ? `Office city: ${context.officeCity}\n` : ""}
Summary: ${context.summary}

View online: ${context.reportUrl}

PDF attached.`;

  return { subject, html, text };
}

export function renderCivicReportAuthorityEmail(
  context: CivicReportAuthorityEmailContext
): RenderedEmail {
  const subject = `[${CIVICAI_PRODUCT_NAME}] New citizen report: ${context.serviceName}`;

  const html = layout(
    `<p>A citizen has submitted a new environmental incident report.</p>
<ul>
  <li><strong>Issue:</strong> ${context.serviceName}</li>
  <li><strong>Responsible authority:</strong> ${context.department}</li>
  <li><strong>Reported by:</strong> ${context.citizenName ?? context.citizenEmail}${context.citizenName ? ` (${context.citizenEmail})` : ""}</li>
  ${context.confidence != null ? `<li><strong>AI confidence:</strong> ${context.confidence}%</li>` : ""}
</ul>
<p><strong>Summary:</strong> ${context.summary}</p>
<p>Review in the authority portal:</p>
<p><a href="${context.authorityReportUrl}">${context.authorityReportUrl}</a></p>
<p>Citizen report link: <a href="${context.reportUrl}">${context.reportUrl}</a></p>
<p>The full incident PDF is attached.</p>
<p style="font-size:12px;color:#666;">Mock environmental data for demonstration purposes.</p>`,
    "New citizen environmental report"
  );

  const text = `New citizen environmental report

Issue: ${context.serviceName}
Authority: ${context.department}
Reported by: ${context.citizenName ?? context.citizenEmail} (${context.citizenEmail})
${context.confidence != null ? `AI confidence: ${context.confidence}%\n` : ""}
Summary: ${context.summary}

Authority portal: ${context.authorityReportUrl}
Citizen report: ${context.reportUrl}

PDF attached.`;

  return { subject, html, text };
}

export function renderTestEmail(context: TestEmailContext): RenderedEmail {
  const name = context.appName ?? appName();
  const subject = `[${name}] Test notification`;

  const html = layout(
    `<p>Hello${context.recipientName ? ` ${context.recipientName}` : ""},</p>
<p>This is a test email from <strong>${name}</strong>. Resend is configured correctly.</p>`,
    "Test notification"
  );

  const text = `Test email from ${name}. Resend is configured correctly.`;

  return { subject, html, text };
}

export function renderEmailTemplate(
  templateId: EmailTemplateId,
  context:
    | IncidentAnalyzedEmailContext
    | IncidentCreatedEmailContext
    | TestEmailContext
    | CivicReportReadyEmailContext
): RenderedEmail {
  switch (templateId) {
    case "incident.analyzed":
      return renderIncidentAnalyzedEmail(context as IncidentAnalyzedEmailContext);
    case "incident.created":
      return renderIncidentCreatedEmail(context as IncidentCreatedEmailContext);
    case "civicai.report.ready":
      return renderCivicReportReadyEmail(context as CivicReportReadyEmailContext);
    case "system.test":
      return renderTestEmail(context as TestEmailContext);
    default:
      throw new Error(`Unknown email template: ${templateId}`);
  }
}
