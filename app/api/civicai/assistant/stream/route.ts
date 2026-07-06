import { AppError } from "@/lib/api/errors";
import { createRequestId, getClientIp } from "@/lib/api/context";
import { API_ERROR_CODES } from "@/lib/api/error-codes";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { logApiRequest, logApiResponse } from "@/lib/api/logger";
import { checkRateLimit, RATE_LIMITS } from "@/lib/api/rate-limit";
import { parseJsonBody } from "@/lib/api/validation/parse-json";
import type { AssistantStreamEvent } from "@/lib/civicai/assistant-stream";
import { civicAssistantRequestSchema } from "@/lib/validations/civicai";
import { authService } from "@/services/auth.service";
import { civicaiService } from "@/services/civicai.service";

export const POST = (request: Request) => {
  return handleServiceRoute(async () => {
    const requestId = createRequestId();
    const ip = getClientIp(request);
    const startedAt = Date.now();
    const route = "POST /api/civicai/assistant/stream";

    logApiRequest({ requestId, route, method: "POST", ip });

    const limit = RATE_LIMITS.ai;
    const rate = checkRateLimit(`${ip}:${route}`, limit);
    if (!rate.allowed) {
      throw new AppError("Too many requests", 429, API_ERROR_CODES.RATE_LIMITED, {
        retryAfterMs: rate.retryAfterMs,
      });
    }

    let user = null;
    try {
      user = await authService.getUser();
    } catch {
      user = null;
    }

    if (!user) {
      throw new AppError("Authentication required", 401, API_ERROR_CODES.UNAUTHORIZED);
    }

    const body = await parseJsonBody(request, civicAssistantRequestSchema);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const send = (event: AssistantStreamEvent) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          await civicaiService.askAssistantWithEvents(
            user!.id,
            body.query,
            body.language,
            send
          );
        } catch (error) {
          if (error instanceof AppError) {
            send({
              type: "error",
              message: error.message,
              code: error.code,
            });
          } else {
            send({
              type: "error",
              message: error instanceof Error ? error.message : "Assistant failed",
            });
          }
        } finally {
          controller.close();
        }
      },
    });

    logApiResponse({
      requestId,
      route,
      status: 200,
      durationMs: Date.now() - startedAt,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "x-request-id": requestId,
      },
    });
  });
};
