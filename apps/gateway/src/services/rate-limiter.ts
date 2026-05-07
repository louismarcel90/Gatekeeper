import { env } from "../config/env";
import { runtimeLogger } from "../observability/runtime-logger";
import { runtimeRedis } from "../runtime/runtime-redis";
import { setDependencyStatus } from "../runtime/runtime-health-registry";

type RateLimitInput = {
  routeId: string;
  clientId: string;
  limitPerMinute: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  current: number;
  retry_after_seconds: number;
  degraded: boolean;
};

export async function checkRateLimit(
  input: RateLimitInput,
): Promise<RateLimitResult> {
  const currentWindow = Math.floor(
    Date.now() / (env.RATE_LIMIT_WINDOW_SECONDS * 1000),
  );

  const redisKey = `rate-limit:${input.clientId}:${input.routeId}:${currentWindow}`;

  try {
    const current = await runtimeRedis.incr(redisKey);

    if (current === 1) {
      await runtimeRedis.expire(redisKey, env.RATE_LIMIT_WINDOW_SECONDS);
    }

    setDependencyStatus({
      dependency: "redis",
      status: "HEALTHY",
      reason: "Redis rate-limit operation succeeded.",
    });

    if (current > input.limitPerMinute) {
      runtimeLogger.warn("Distributed rate limit exceeded.", {
        client_id: input.clientId,
        route_id: input.routeId,
        limit: input.limitPerMinute,
        current,
        retry_after_seconds: env.RATE_LIMIT_WINDOW_SECONDS,
      });

      return {
        allowed: false,
        limit: input.limitPerMinute,
        current,
        retry_after_seconds: env.RATE_LIMIT_WINDOW_SECONDS,
        degraded: false,
      };
    }

    return {
      allowed: true,
      limit: input.limitPerMinute,
      current,
      retry_after_seconds: 0,
      degraded: false,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Redis rate-limit operation failed.";

    setDependencyStatus({
      dependency: "redis",
      status: "UNAVAILABLE",
      reason: message,
    });

    runtimeLogger.error("Redis rate-limit operation failed; failing open.", {
      client_id: input.clientId,
      route_id: input.routeId,
      error_message: message,
    });

    return {
      allowed: true,
      limit: input.limitPerMinute,
      current: 0,
      retry_after_seconds: 0,
      degraded: true,
    };
  }
}