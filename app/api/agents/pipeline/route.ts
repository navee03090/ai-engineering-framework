import { orchestrator } from "@/agents/orchestrator";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { agentPipelineRequestSchema } from "@/lib/validations/agents";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400, "INVALID_JSON");
  }

  const parsed = agentPipelineRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid request", 400, "VALIDATION_ERROR");
  }

  if (!process.env.GEMINI_API_KEY) {
    return apiError("GEMINI_API_KEY is not configured.", 503, "AI_UNAVAILABLE");
  }

  const { steps, context } = parsed.data;
  const result = await orchestrator.runPipeline(steps, context);

  if (!result.success) {
    return apiError("Pipeline execution failed", 422, "PIPELINE_FAILED", result);
  }

  return apiSuccess(result);
}
