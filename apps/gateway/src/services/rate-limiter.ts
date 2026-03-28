import { redisClient } from "../infrastructure/redis-client";

const WINDOW_SECONDS = 60;

export type RateLimitResult = {
  allowed: boolean;
  current: number;
  limit: number;
  retry_after_seconds: number;
};

function buildRateLimitKey(routeId: string, clientId: string): string {
  return `gatekeeper:ratelimit:${routeId}:${clientId}`;
}

export async function checkRateLimit(params: {
  routeId: string;
  clientId: string;
  limitPerMinute: number;
}): Promise<RateLimitResult> {
  const key = buildRateLimitKey(params.routeId, params.clientId);

  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, WINDOW_SECONDS);
  }

  const ttl = await redisClient.ttl(key);

  return {
    allowed: current <= params.limitPerMinute,
    current,
    limit: params.limitPerMinute,
    retry_after_seconds: ttl > 0 ? ttl : WINDOW_SECONDS,
  };
}
