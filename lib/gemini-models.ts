export type GeminiTask =
  | "intent"
  | "recommendation"
  | "compliance"
  | "ocr"
  | "vision"
  | "general";

const DEFAULT_OUTPUT_LIMITS: Record<GeminiTask, number> = {
  intent: 512,
  recommendation: 1024,
  compliance: 768,
  ocr: 768,
  vision: 768,
  general: 1024,
};

export function parseModelList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

export function getGeminiModelPool(task: GeminiTask = "general"): string[] {
  const taskEnv = process.env[`GEMINI_MODEL_${task.toUpperCase()}`];
  const taskModels = parseModelList(taskEnv);
  if (taskModels.length > 0) return [...new Set(taskModels)];

  const pool = parseModelList(process.env.GEMINI_MODELS);
  if (pool.length > 0) return [...new Set(pool)];

  const primary = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
  const fallbacks = parseModelList(
    process.env.GEMINI_FALLBACK_MODELS ??
      "gemini-2.5-flash,gemini-2.0-flash,gemini-flash-latest"
  );
  return [...new Set([primary, ...fallbacks])];
}

export function getMaxOutputTokens(task: GeminiTask = "general"): number {
  const taskEnv = process.env[`GEMINI_MAX_OUTPUT_${task.toUpperCase()}`];
  if (taskEnv && Number.isFinite(Number(taskEnv))) return Number(taskEnv);

  const globalMax = process.env.GEMINI_MAX_OUTPUT_TOKENS;
  if (globalMax && Number.isFinite(Number(globalMax))) return Number(globalMax);

  return DEFAULT_OUTPUT_LIMITS[task];
}

/** @deprecated Use getGeminiModelPool() */
export function getGeminiModelCandidates(): string[] {
  return getGeminiModelPool("general");
}
