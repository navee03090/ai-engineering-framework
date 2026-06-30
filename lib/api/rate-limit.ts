export type RateLimitConfig = {
  windowMs: number;
  max: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const RATE_LIMITS = {
  default: { windowMs: 60_000, max: 60 },
  ai: { windowMs: 60_000, max: 10 },
  auth: { windowMs: 60_000, max: 20 },
} as const;

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return { allowed: true, remaining: config.max - 1 };
  }

  if (bucket.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: bucket.resetAt - now,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return { allowed: true, remaining: config.max - bucket.count };
}

export function resetRateLimits(): void {
  buckets.clear();
}
