import type { User } from "@supabase/supabase-js";
import type { z } from "zod";

import { createRequestId, getClientIp } from "@/lib/api/context";
import { API_ERROR_CODES } from "@/lib/api/error-codes";
import { AppError } from "@/lib/api/errors";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { logApiError, logApiRequest, logApiResponse } from "@/lib/api/logger";
import {
  checkRateLimit,
  RATE_LIMITS,
  type RateLimitConfig,
} from "@/lib/api/rate-limit";
import { parseJsonBody } from "@/lib/api/validation/parse-json";
import { parseQueryParams } from "@/lib/api/validation/parse-query";
import { authService } from "@/services/auth.service";

export type ApiHandlerContext<
  TBody = undefined,
  TQuery = undefined,
  TParams = Record<string, never>,
> = {
  request: Request;
  requestId: string;
  ip: string;
  body: TBody;
  query: TQuery;
  params: TParams;
  user: User | null;
};

export type CreateApiHandlerConfig<
  TBody = undefined,
  TQuery = undefined,
  TParams = Record<string, never>,
> = {
  route: string;
  rateLimit?: RateLimitConfig | false;
  auth?: boolean;
  bodySchema?: z.ZodType<TBody>;
  querySchema?: z.ZodType<TQuery>;
  handler: (context: ApiHandlerContext<TBody, TQuery, TParams>) => Promise<Response>;
};

function withApiHeaders(response: Response, requestId: string): Response {
  const headers = new Headers(response.headers);
  headers.set("x-request-id", requestId);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createApiHandler<
  TBody = undefined,
  TQuery = undefined,
  TParams = Record<string, never>,
>(config: CreateApiHandlerConfig<TBody, TQuery, TParams>) {
  return (
    request: Request,
    routeContext?: { params: Promise<TParams> }
  ): Promise<Response> => {
    return handleServiceRoute(async () => {
      const requestId = createRequestId();
      const ip = getClientIp(request);
      const startedAt = Date.now();

      logApiRequest({
        requestId,
        route: config.route,
        method: request.method,
        ip,
      });

      if (config.rateLimit !== false) {
        const limit = config.rateLimit ?? RATE_LIMITS.default;
        const result = checkRateLimit(`${ip}:${config.route}`, limit);

        if (!result.allowed) {
          throw new AppError("Too many requests", 429, API_ERROR_CODES.RATE_LIMITED, {
            retryAfterMs: result.retryAfterMs,
          });
        }
      }

      let user: User | null = null;

      if (config.auth) {
        try {
          user = await authService.getUser();
        } catch {
          user = null;
        }

        if (!user) {
          throw new AppError(
            "Authentication required",
            401,
            API_ERROR_CODES.UNAUTHORIZED
          );
        }
      }

      const params = routeContext?.params ? await routeContext.params : ({} as TParams);

      const body = config.bodySchema
        ? await parseJsonBody(request, config.bodySchema)
        : (undefined as TBody);

      const query = config.querySchema
        ? parseQueryParams(request, config.querySchema)
        : (undefined as TQuery);

      try {
        const response = await config.handler({
          request,
          requestId,
          ip,
          body,
          query,
          params,
          user,
        });

        logApiResponse({
          requestId,
          route: config.route,
          status: response.status,
          durationMs: Date.now() - startedAt,
        });

        return withApiHeaders(response, requestId);
      } catch (error) {
        logApiError({ requestId, route: config.route, error });
        throw error;
      }
    });
  };
}

export { RATE_LIMITS };
