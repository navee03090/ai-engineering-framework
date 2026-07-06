const RETRYABLE_PATTERN =
  /503|high demand|unavailable|overloaded|resource exhausted|try again later/i;

const RATE_LIMIT_PATTERN = /429|too many requests/i;

const QUOTA_PATTERN =
  /quota exceeded|exceeded your current quota|rate-limit|limit:\s*0/i;

const INVALID_MODEL_PATTERN =
  /404|not found|not supported for generatecontent|listmodels/i;

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGeminiModelCandidates(): string[] {
  const primary = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
  const fallbacks = (
    process.env.GEMINI_FALLBACK_MODELS ?? "gemini-2.5-flash,gemini-flash-latest"
  )
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set([primary, ...fallbacks])];
}

/** Retry transient Gemini errors (503/429) with backoff and skip invalid models (404). */
export async function withGeminiRetry<T>(
  operation: (modelName: string) => Promise<T>
): Promise<T> {
  const models = getGeminiModelCandidates();
  let lastError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
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

        if (isGeminiQuotaError(error)) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[gemini] Quota/rate limit for model ${modelName}, trying next...`);
          }
          break;
        }

        if (!isRetryableGeminiError(error)) {
          throw error;
        }

        if (attempt < 2) {
          await sleep(1000 * (attempt + 1));
        }
      }
    }
  }

  throw lastError instanceof Error
    ? new Error(formatGeminiErrorForUser(lastError))
    : new Error("Gemini is temporarily unavailable. Please try again in a moment.");
}
