import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { civicService } from "@/services/civic.service";

type IncidentParams = { id: string };

export const POST = createApiHandler<undefined, undefined, IncidentParams>({
  route: "POST /api/civic/incidents/[id]/analyze",
  rateLimit: RATE_LIMITS.ai,
  auth: true,
  handler: async ({ params }) => {
    const user = await authService.getUser();
    const result = await civicService.analyzeWithEscalation(params.id, user?.email);

    const pipelineSteps = result.pipeline.steps.map((step) => ({
      agent: step.agent,
      success: step.result.success,
      durationMs: step.result.metadata?.durationMs,
    }));

    return apiSuccess({
      incident: result.incident,
      pipeline: {
        runId: result.pipeline.runId,
        success: result.pipeline.success,
        steps: pipelineSteps,
      },
      escalated: result.escalated,
      escalation: result.escalation,
    });
  },
});
