import { describe, expect, it, beforeEach } from "vitest";
import { z } from "zod";

import { AppError } from "@/lib/api/errors";
import { parseJsonBody, parseQueryParams } from "@/lib/api/validation";
import { checkRateLimit, resetRateLimits, RATE_LIMITS } from "@/lib/api/rate-limit";
import { createApiHandler } from "@/lib/api/create-handler";
import { apiSuccess } from "@/lib/api/responses";

describe("parseJsonBody", () => {
  it("parses and validates JSON body", async () => {
    const schema = z.object({ name: z.string() });
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ name: "AEF" }),
    });

    const result = await parseJsonBody(request, schema);
    expect(result).toEqual({ name: "AEF" });
  });

  it("throws AppError for invalid JSON", async () => {
    const schema = z.object({ name: z.string() });
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      body: "{",
    });

    await expect(parseJsonBody(request, schema)).rejects.toMatchObject({
      code: "INVALID_JSON",
      status: 400,
    });
  });
});

describe("parseQueryParams", () => {
  it("parses query string", () => {
    const schema = z.object({ tag: z.string().optional() });
    const request = new Request("http://localhost/api/prompts?tag=disaster");

    expect(parseQueryParams(request, schema)).toEqual({ tag: "disaster" });
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests under the limit", () => {
    const config = { windowMs: 60_000, max: 2 };
    expect(checkRateLimit("ip:test", config).allowed).toBe(true);
    expect(checkRateLimit("ip:test", config).allowed).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const config = { windowMs: 60_000, max: 1 };
    checkRateLimit("ip:block", config);
    const blocked = checkRateLimit("ip:block", config);

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
});

describe("createApiHandler", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("returns success response with request id header", async () => {
    const GET = createApiHandler({
      route: "GET /api/test",
      rateLimit: false,
      handler: async () => apiSuccess({ ok: true }),
    });

    const response = await GET(new Request("http://localhost/api/test"));
    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBeTruthy();

    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("returns 429 when rate limited", async () => {
    const GET = createApiHandler({
      route: "GET /api/rate-test",
      rateLimit: { windowMs: 60_000, max: 1 },
      handler: async () => apiSuccess({ ok: true }),
    });

    await GET(new Request("http://localhost/api/rate-test"));
    const blocked = await GET(new Request("http://localhost/api/rate-test"));

    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error.code).toBe("RATE_LIMITED");
  });

  it("validates body schema", async () => {
    const POST = createApiHandler({
      route: "POST /api/validate-test",
      rateLimit: false,
      bodySchema: z.object({ value: z.string().min(3) }),
      handler: async ({ body }) => apiSuccess(body),
    });

    const bad = await POST(
      new Request("http://localhost/api/validate-test", {
        method: "POST",
        body: JSON.stringify({ value: "x" }),
      })
    );

    expect(bad.status).toBe(400);
  });

  it("requires auth when configured", async () => {
    const GET = createApiHandler({
      route: "GET /api/protected-test",
      rateLimit: false,
      auth: true,
      handler: async () => apiSuccess({ ok: true }),
    });

    const response = await GET(new Request("http://localhost/api/protected-test"));
    expect(response.status).toBe(401);
  });
});

describe("RATE_LIMITS", () => {
  it("defines presets for route categories", () => {
    expect(RATE_LIMITS.ai.max).toBeLessThan(RATE_LIMITS.default.max);
    expect(RATE_LIMITS.auth.max).toBeLessThan(RATE_LIMITS.default.max);
  });
});

describe("AppError", () => {
  it("stores status and code", () => {
    const error = new AppError("Denied", 403, "FORBIDDEN");
    expect(error.status).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });
});
