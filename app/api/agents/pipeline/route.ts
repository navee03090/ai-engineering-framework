import { apiError, apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { agentPipelineRequestSchema } from "@/lib/validations/agents";
import { aiService } from "@/services/ai.service";

export const POST = createApiHandler({
  route: "POST /api/agents/pipeline",
  rateLimit: RATE_LIMITS.ai,
  bodySchema: agentPipelineRequestSchema,
  handler: async ({ body }) => {
    const { steps, context } = body;
    const result = await aiService.runPipeline(steps, context);

    if (!result.success) {
      return apiError("Pipeline execution failed", 422, "PIPELINE_FAILED", result);
    }

    return apiSuccess(result);
  },
});
