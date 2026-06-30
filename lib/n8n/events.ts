import type { N8nEnvelope, N8nEventName } from "@/lib/n8n/types";

export const N8N_EVENT_CATALOG: Record<
  N8nEventName,
  { description: string; samplePayload: Record<string, unknown> }
> = {
  "incident.created": {
    description: "Fired when a new incident is submitted.",
    samplePayload: {
      incidentId: "uuid",
      title: "Flash flood near Mingora",
      location: "Swat",
      description: "Roads blocked, families stranded.",
    },
  },
  "incident.analyzed": {
    description: "Fired after AI classifies and summarizes an incident.",
    samplePayload: {
      incidentId: "uuid",
      title: "Flash flood near Mingora",
      category: "flood",
      severity: "high",
      summary: "Roads blocked near Mingora.",
      recommendedAction: "Deploy rescue teams.",
      critical: true,
    },
  },
  "incident.attachment.uploaded": {
    description: "Fired when evidence is attached to an incident.",
    samplePayload: {
      incidentId: "uuid",
      attachmentId: "uuid",
      fileName: "photo.jpg",
      mimeType: "image/jpeg",
      category: "image",
    },
  },
  "system.test": {
    description: "Connectivity check from the notifications UI.",
    samplePayload: {
      message: "AEF n8n webhook test",
      triggeredBy: "user@example.com",
    },
  },
};

function appName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? "AI Engineering Framework";
}

function environment(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function buildN8nEnvelope<TPayload extends Record<string, unknown>>(
  event: N8nEventName | string,
  payload: TPayload
): N8nEnvelope<TPayload> {
  return {
    event,
    payload,
    timestamp: new Date().toISOString(),
    source: "aef",
    appName: appName(),
    environment: environment(),
  };
}

export function buildIncidentCreatedPayload(incident: {
  id: string;
  title: string;
  description: string;
  location?: string | null;
}) {
  return {
    incidentId: incident.id,
    title: incident.title,
    location: incident.location ?? null,
    description: incident.description,
  };
}

export function buildIncidentAnalyzedPayload(incident: {
  id: string;
  title: string;
  category?: string | null;
  severity?: string | null;
  summary?: string | null;
  recommendedAction?: string | null;
}) {
  return {
    incidentId: incident.id,
    title: incident.title,
    category: incident.category ?? null,
    severity: incident.severity ?? null,
    summary: incident.summary ?? null,
    recommendedAction: incident.recommendedAction ?? null,
    critical: ["high", "critical"].includes(incident.severity ?? ""),
  };
}

export function buildAttachmentUploadedPayload(attachment: {
  incidentId: string;
  attachmentId: string;
  fileName: string;
  mimeType: string;
  category: string;
  fileSize: number;
}) {
  return {
    incidentId: attachment.incidentId,
    attachmentId: attachment.attachmentId,
    fileName: attachment.fileName,
    mimeType: attachment.mimeType,
    category: attachment.category,
    fileSize: attachment.fileSize,
  };
}

export function buildTestPayload(triggeredBy: string) {
  return {
    message: "AEF n8n webhook test",
    triggeredBy,
  };
}
