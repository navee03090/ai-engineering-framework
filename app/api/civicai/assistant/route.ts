import { apiError, apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { AppError } from "@/lib/api/errors";
import { civicAssistantRequestSchema } from "@/lib/validations/civicai";
import { civicaiService } from "@/services/civicai.service";

export const POST = createApiHandler({
  route: "POST /api/civicai/assistant",
  auth: true,
  rateLimit: RATE_LIMITS.ai,
  bodySchema: civicAssistantRequestSchema,
  handler: async ({ body, user }) => {
    try {
      const result = await civicaiService.askAssistant(
        user!.id,
        body.query,
        body.language
      );
      return apiSuccess(result);
    } catch (error) {
      if (error instanceof AppError && error.code === "CIVICAI_NEEDS_CLARIFICATION") {
        return apiError(error.message, 422, error.code, error.details);
      }
      throw error;
    }
  },
});
