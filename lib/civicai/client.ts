import type { AssistantStreamEvent } from "@/lib/civicai/assistant-stream";
import type { CivicLanguage } from "@/lib/civicai/language";
import type { AssistantApiResponse, DocumentStatus } from "@/lib/civicai/types";

export type { AssistantApiResponse } from "@/lib/civicai/types";

export type VerifyDocumentApiResponse = {
  serviceName: string;
  confidence: number;
  extractedDocuments: { name: string; status: DocumentStatus }[];
  advisory: string;
  missingDocuments?: string[];
  suspiciousRequests?: string[];
  ocrRawText?: string;
  ocrConfidence?: number;
  ocrDocuments?: { name: string; normalizedName?: string; confidence?: number }[];
  reportId?: string;
  verificationId?: string;
};

export type HistoryApiItem = {
  id: string;
  query: string;
  language: string;
  detected_intent: string | null;
  service_slug: string | null;
  confidence: number | null;
  status: string;
  created_at: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export const CIVIC_LAST_RESPONSE_KEY = "civicai-last-response";

async function parseApi<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function askCivicAssistant(
  query: string,
  language: CivicLanguage
): Promise<AssistantApiResponse> {
  const res = await fetch("/api/civicai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, language }),
  });

  const data = await parseApi<AssistantApiResponse>(res);
  persistAssistantResponse(data);
  return data;
}

function persistAssistantResponse(data: AssistantApiResponse) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CIVIC_LAST_RESPONSE_KEY, JSON.stringify(data));
  }
}

export async function askCivicAssistantStream(
  query: string,
  language: CivicLanguage,
  onEvent: (event: AssistantStreamEvent) => void
): Promise<AssistantApiResponse> {
  const res = await fetch("/api/civicai/assistant/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, language }),
  });

  if (!res.ok || !res.body) {
    const json = (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    throw new Error(json?.error ?? "Stream request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: AssistantApiResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (!payload) continue;

      const event = JSON.parse(payload) as AssistantStreamEvent;
      onEvent(event);

      if (event.type === "complete") {
        finalResult = event.result;
        persistAssistantResponse(event.result);
      }

      if (event.type === "error") {
        throw new Error(event.message);
      }
    }
  }

  if (!finalResult) {
    throw new Error("Assistant stream ended without a result");
  }

  return finalResult;
}

export async function verifyCivicDocument(
  file: File,
  options: { serviceId?: string; language: CivicLanguage }
): Promise<VerifyDocumentApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.serviceId) formData.append("serviceId", options.serviceId);
  formData.append("language", options.language);

  const res = await fetch("/api/civicai/verify-document", {
    method: "POST",
    body: formData,
  });

  return parseApi<VerifyDocumentApiResponse>(res);
}

export async function fetchCivicHistory(): Promise<HistoryApiItem[]> {
  const res = await fetch("/api/civicai/history");
  const data = await parseApi<{ items: HistoryApiItem[] }>(res);
  return data.items;
}

export async function fetchCivicReport(reportId: string) {
  const res = await fetch(`/api/civicai/reports/${reportId}`);
  return parseApi<{
    id: string;
    summary: string;
    report_json: unknown;
    service_slug: string | null;
    qr_data: string | null;
    created_at: string;
  }>(res);
}

export async function fetchCivicStats() {
  const res = await fetch("/api/civicai/stats");
  return parseApi<{
    totalRequests: number;
    totalVerifications: number;
    totalReports: number;
  }>(res);
}

export function getLastAssistantResponse(): AssistantApiResponse | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CIVIC_LAST_RESPONSE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AssistantApiResponse;
  } catch {
    return null;
  }
}

export async function streamTextEffect(
  text: string,
  onChunk: (accumulated: string) => void,
  delayMs = 25
): Promise<void> {
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    accumulated += (i > 0 ? " " : "") + words[i];
    onChunk(accumulated);
  }
}
