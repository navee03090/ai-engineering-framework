import { aiService } from "@/services/ai.service";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { agentRunRequestSchema } from "@/lib/validations/agents";

export async function POST(request: Request) {
  return handleServiceRoute(async () => {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body", 400, "INVALID_JSON");
    }

    const parsed = agentRunRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message ?? "Invalid request",
        400,
        "VALIDATION_ERROR"
      );
    }

    const { agent, input, context } = parsed.data;
    const result = await aiService.runAgent(agent, input, context);

    if (!result.success) {
      return apiError(result.error ?? "Agent run failed", 422, "AGENT_RUN_FAILED", result);
    }

    return apiSuccess(result);
  });
}
