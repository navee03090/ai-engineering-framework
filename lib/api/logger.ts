type ApiLogBase = {
  requestId: string;
  route: string;
};

export function logApiRequest(
  event: ApiLogBase & { method: string; ip: string }
): void {
  const payload = {
    type: "api.request",
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(payload));
    return;
  }

  console.info(`[api] ${event.method} ${event.route} (${event.requestId})`);
}

export function logApiResponse(
  event: ApiLogBase & { status: number; durationMs: number }
): void {
  const payload = {
    type: "api.response",
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(payload));
    return;
  }

  console.info(
    `[api] ${event.route} -> ${event.status} (${event.durationMs}ms) ${event.requestId}`
  );
}

export function logApiError(event: ApiLogBase & { error: unknown }): void {
  const message =
    event.error instanceof Error ? event.error.message : "Unknown API error";
  const payload = {
    type: "api.error",
    ...event,
    message,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(payload));
}
