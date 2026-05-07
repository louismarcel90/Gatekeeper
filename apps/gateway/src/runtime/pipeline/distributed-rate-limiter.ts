import { env } from "../../config/env";
import { runtimeRedis } from "../runtime-redis";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export async function evaluateDistributedRateLimit(params: {
  clientId: string;
  routeId: string;
  limitPerMinute: number;
}): Promise<RateLimitResult> {
  const currentWindow = Math.floor(
    Date.now() / (env.RATE_LIMIT_WINDOW_SECONDS * 1000),
  );

  const redisKey =
    `rate-limit:${params.clientId}:${params.routeId}:${currentWindow}`;

  const currentCount = await runtimeRedis.incr(redisKey);

  if (currentCount === 1) {
    await runtimeRedis.expire(
      redisKey,
      env.RATE_LIMIT_WINDOW_SECONDS,
    );
  }

  const remaining = Math.max(
    params.limitPerMinute - currentCount,
    0,
  );

  if (currentCount > params.limitPerMinute) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: env.RATE_LIMIT_WINDOW_SECONDS,
    };
  }

  return {
    allowed: true,
    remaining,
    retryAfterSeconds: 0,
  };
}