import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeMetrics } from "../observability/runtime-metrics";
import { getRuntimeHealth } from "../runtime/runtime-health-registry";
import { getRuntimeSnapshotCache } from "../snapshot/runtime-snapshot-store";

function calculateUptimeSeconds(startedAt: string): number {
  const startedAtMs = new Date(startedAt).getTime();
  return Math.max(Math.floor((Date.now() - startedAtMs) / 1000), 0);
}

export async function registerRuntimeMetricsRoute(app: FastifyInstance): Promise<void> {
  app.get("/runtime/metrics", async () => {
    const metrics = getRuntimeMetrics();
    const health = getRuntimeHealth();
    const snapshotCache = getRuntimeSnapshotCache();

    return {
      instance_id: env.GATEWAY_INSTANCE_ID,
      service: "gatekeeper-gateway",
      status: health.status,
      uptime_seconds: calculateUptimeSeconds(metrics.startedAt),
      active_snapshot_version: snapshotCache.activeSnapshot?.version ?? null,
      snapshot_status: snapshotCache.status,
      counters: {
        decisions: {
          allow: metrics.allowCount,
          deny: metrics.denyCount,
          throttle: metrics.throttleCount,
        },
        enforcement: {
          rate_limit_exceeded: metrics.rateLimitExceededCount,
          quota_exceeded: metrics.quotaExceededCount,
        },
        snapshot: {
          refresh_success: metrics.snapshotRefreshSuccessCount,
          refresh_failure: metrics.snapshotRefreshFailureCount,
        },
        dependencies: {
          redis_failure: metrics.redisFailureCount,
        },
      },
    };
  });
}
