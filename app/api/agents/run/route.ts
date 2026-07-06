import { apiError, apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { agentRunRequestSchema } from "@/lib/validations/agents";
import { aiService } from "@/services/ai.service";

export const POST = createApiHandler({
  route: "POST /api/agents/run",
  rateLimit: RATE_LIMITS.ai,
  bodySchema: agentRunRequestSchema,
  handler: async ({ body }) => {
    const { agent, input, context } = body;
    const result = await aiService.runAgent(agent, input, context);

    if (!result.success) {
      return apiError(
        result.error ?? "Agent run failed",
        422,
        "AGENT_RUN_FAILED",
        result
      );
    }

    return apiSuccess(result);
  },
});
