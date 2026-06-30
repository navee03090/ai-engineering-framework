import { orchestrator } from "@/agents/orchestrator";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { agentRunRequestSchema } from "@/lib/validations/agents";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400, "INVALID_JSON");
  }

  const parsed = agentRunRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid request", 400, "VALIDATION_ERROR");
  }

  if (!process.env.GEMINI_API_KEY) {
    return apiError("GEMINI_API_KEY is not configured.", 503, "AI_UNAVAILABLE");
  }

  const { agent, input, context } = parsed.data;
  const result = await orchestrator.run(agent, input, context);

  if (!result.success) {
    return apiError(result.error ?? "Agent run failed", 422, "AGENT_RUN_FAILED", result);
  }

  return apiSuccess(result);
}
