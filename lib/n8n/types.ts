export const N8N_EVENT_NAMES = [
  "incident.created",
  "incident.analyzed",
  "incident.attachment.uploaded",
  "system.test",
] as const;

export type N8nEventName = (typeof N8N_EVENT_NAMES)[number];

export type N8nEnvelope<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  event: N8nEventName | string;
  payload: TPayload;
  timestamp: string;
  source: "aef";
  appName: string;
  environment: string;
};

export type N8nWebhookResult = {
  delivered: boolean;
  status: number;
  event: string;
};

export type N8nStatus = {
  configured: boolean;
  webhookUrl: string | null;
  hasSecret: boolean;
  events: N8nEventName[];
};
