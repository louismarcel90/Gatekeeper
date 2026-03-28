import { redisClient } from "../infrastructure/redis-client";

const WINDOW_SECONDS = 24 * 60 * 60;

export type QuotaResult = {
  allowed: boolean;
  current: number;
  limit: number;
  retry_after_seconds: number;
};

function getUtcDayKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function buildQuotaKey(routeId: string, clientId: string): string {
  return `gatekeeper:quota:${getUtcDayKey()}:${routeId}:${clientId}`;
}

export async function checkQuota(params: {
  routeId: string;
  clientId: string;
  limitPerDay: number;
}): Promise<QuotaResult> {
  const key = buildQuotaKey(params.routeId, params.clientId);

  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, WINDOW_SECONDS);
  }

  const ttl = await redisClient.ttl(key);

  return {
    allowed: current <= params.limitPerDay,
    current,
    limit: params.limitPerDay,
    retry_after_seconds: ttl > 0 ? ttl : WINDOW_SECONDS,
  };
}
