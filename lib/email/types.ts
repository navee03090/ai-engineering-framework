export type IncidentAnalyzedEmailContext = {
  incidentId: string;
  title: string;
  category?: string | null;
  severity?: string | null;
  summary?: string | null;
  recommendedAction?: string | null;
  appName?: string;
};

export type IncidentCreatedEmailContext = {
  incidentId: string;
  title: string;
  location?: string | null;
  description: string;
  appName?: string;
};

export type TestEmailContext = {
  recipientName?: string;
  appName?: string;
};

export type CivicReportReadyEmailContext = {
  recipientName?: string;
  serviceName: string;
  department: string;
  fee: string;
  processingTime: string;
  summary: string;
  reportUrl: string;
  officeCity?: string;
  appName?: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

export type EmailTemplateId =
  "incident.analyzed" | "incident.created" | "system.test" | "civicai.report.ready";
