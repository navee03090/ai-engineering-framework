import { aiService } from "@/services/ai.service";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { agentPipelineRequestSchema } from "@/lib/validations/agents";

export async function POST(request: Request) {
  return handleServiceRoute(async () => {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body", 400, "INVALID_JSON");
    }

    const parsed = agentPipelineRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message ?? "Invalid request",
        400,
        "VALIDATION_ERROR"
      );
    }

    const { steps, context } = parsed.data;
    const result = await aiService.runPipeline(steps, context);

    if (!result.success) {
      return apiError("Pipeline execution failed", 422, "PIPELINE_FAILED", result);
    }

    return apiSuccess(result);
  });
}
