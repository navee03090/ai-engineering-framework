import { AppError } from "@/lib/api/errors";
import { buildN8nEnvelope } from "@/lib/n8n/events";
import type { N8nWebhookResult } from "@/lib/n8n/types";

function getWebhookUrl(): string {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new AppError("N8N_WEBHOOK_URL is not configured.", 503, "N8N_UNAVAILABLE");
  }

  return webhookUrl;
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "AEF/1.0",
  };

  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (secret) {
    headers["x-aef-webhook-secret"] = secret;
  }

  return headers;
}

export async function deliverN8nWebhook(
  event: string,
  payload: Record<string, unknown>
): Promise<N8nWebhookResult> {
  const envelope = buildN8nEnvelope(event, payload);

  const response = await fetch(getWebhookUrl(), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(envelope),
  });

  if (!response.ok) {
    throw new AppError("n8n webhook call failed.", 502, "N8N_WEBHOOK_FAILED", {
      status: response.status,
      event,
    });
  }

  return {
    delivered: true,
    status: response.status,
    event,
  };
}
