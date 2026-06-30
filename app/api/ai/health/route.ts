import { z } from "zod";

import { apiError, apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { generateStructuredResponse } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompt-manager";

const healthSchema = z.object({
  status: z.literal("ok"),
  message: z.string(),
});

export const POST = createApiHandler({
  route: "POST /api/ai/health",
  rateLimit: RATE_LIMITS.ai,
  handler: async () => {
    if (!process.env.GEMINI_API_KEY) {
      return apiError("GEMINI_API_KEY is not configured.", 503, "AI_UNAVAILABLE");
    }

    const result = await generateStructuredResponse(
      "Return a short JSON health check for the AI layer.",
      healthSchema,
      {
        systemInstruction: buildSystemPrompt({
          projectName: "AEF",
          environment: process.env.NODE_ENV ?? "development",
        }),
        temperature: 0,
      }
    );

    return apiSuccess({ ok: true, result });
  },
});
