import type { GeminiTask } from "@/lib/gemini-models";
import { getGeminiModelPool } from "@/lib/gemini-models";

const RETRYABLE_PATTERN =
  /503|high demand|unavailable|overloaded|resource exhausted|try again later/i;

const RATE_LIMIT_PATTERN = /429|too many requests/i;

const QUOTA_PATTERN =
  /quota exceeded|exceeded your current quota|rate-limit|limit:\s*0/i;

const INVALID_MODEL_PATTERN =
  /404|not found|not supported for generatecontent|listmodels/i;

const modelBusyUntil = new Map<string, number>();
let poolRotationIndex = 0;

export function isRetryableGeminiError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return RETRYABLE_PATTERN.test(message) || RATE_LIMIT_PATTERN.test(message);
}

export function isGeminiQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return QUOTA_PATTERN.test(message) || /429 Too Many Requests/.test(message);
}

export function formatGeminiErrorForUser(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (isGeminiQuotaError(error)) {
    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    const retryHint = retryMatch
      ? ` Try again in about ${Math.ceil(Number(retryMatch[1]))} seconds.`
      : " Wait a minute and try again.";
    return `Gemini API quota limit reached.${retryHint} For the hackathon demo, open /reports/demo or use a fresh API key with billing enabled at https://ai.google.dev`;
  }

  if (isRetryableGeminiError(error)) {
    return "Gemini is busy right now. Please wait a moment and try again.";
  }

  return message || "AI request failed. Please try again.";
}

export function isInvalidGeminiModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return INVALID_MODEL_PATTERN.test(message);
}

export function markModelBusy(modelName: string, cooldownMs = 45_000): void {
  modelBusyUntil.set(modelName, Date.now() + cooldownMs);
}

export function isModelBusy(modelName: string): boolean {
  const until = modelBusyUntil.get(modelName);
  if (!until) return false;
  if (Date.now() >= until) {
    modelBusyUntil.delete(modelName);
    return false;
  }
  return true;
}

function orderModelsByHealth(models: string[]): string[] {
  const available = models.filter((model) => !isModelBusy(model));
  const busy = models.filter((model) => isModelBusy(model));
  const pool = available.length > 0 ? available : models;

  const start = poolRotationIndex % pool.length;
  poolRotationIndex += 1;

  return [...pool.slice(start), ...pool.slice(0, start), ...busy];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type GeminiRetryOptions = {
  task?: GeminiTask;
};

/** Retry transient Gemini errors; rotate across model pool when busy or rate-limited. */
export async function withGeminiRetry<T>(
  operation: (modelName: string) => Promise<T>,
  options: GeminiRetryOptions = {}
): Promise<T> {
  const models = orderModelsByHealth(getGeminiModelPool(options.task ?? "general"));
  let lastError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await operation(modelName);
      } catch (error) {
        lastError = error;

        if (isInvalidGeminiModelError(error)) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[gemini] Skipping unavailable model: ${modelName}`);
          }
          break;
        }

        if (isGeminiQuotaError(error) || isRetryableGeminiError(error)) {
          markModelBusy(modelName);
          if (process.env.NODE_ENV === "development") {
            console.warn(`[gemini] Model busy ${modelName}, switching...`);
          }
          if (isRetryableGeminiError(error) && !isGeminiQuotaError(error) && attempt < 1) {
            await sleep(800 * (attempt + 1));
            continue;
          }
          break;
        }

        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? new Error(formatGeminiErrorForUser(lastError))
    : new Error("Gemini is temporarily unavailable. Please try again in a moment.");
}
