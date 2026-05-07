import { env } from "../config/env";
import { runtimeRedis } from "../runtime/runtime-redis";
import { setDependencyStatus } from "../runtime/runtime-health-registry";

type QuotaInput = {
  routeId: string;
  clientId: string;
  limitPerDay: number;
};

type QuotaResult = {
  allowed: boolean;
  limit: number;
  current: number;
  retry_after_seconds: number;
  degraded: boolean;
};

function getUtcDayKey(): string {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function checkQuota(input: QuotaInput): Promise<QuotaResult> {
  const dayKey = getUtcDayKey();
  const redisKey = `quota:${input.clientId}:${input.routeId}:${dayKey}`;

  try {
    const current = await runtimeRedis.incr(redisKey);

    if (current === 1) {
      await runtimeRedis.expire(redisKey, env.QUOTA_WINDOW_SECONDS);
    }

    setDependencyStatus({
      dependency: "redis",
      status: "HEALTHY",
      reason: "Redis quota operation succeeded.",
    });

    if (current > input.limitPerDay) {
      return {
        allowed: false,
        limit: input.limitPerDay,
        current,
        retry_after_seconds: env.QUOTA_WINDOW_SECONDS,
        degraded: false,
      };
    }

    return {
      allowed: true,
      limit: input.limitPerDay,
      current,
      retry_after_seconds: 0,
      degraded: false,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Redis quota operation failed.";

    setDependencyStatus({
      dependency: "redis",
      status: "UNAVAILABLE",
      reason: message,
    });

    return {
      allowed: true,
      limit: input.limitPerDay,
      current: 0,
      retry_after_seconds: 0,
      degraded: true,
    };
  }
}