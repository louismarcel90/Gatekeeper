import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeMetrics } from "../observability/runtime-metrics";
import { getRuntimeHealth } from "../runtime/runtime-health-registry";
import { getRuntimeSnapshotCache } from "../snapshot/runtime-snapshot-store";
import { getRuntimeIntegrityState } from "../runtime/runtime-integrity-state";

function calculateUptimeSeconds(startedAt: string): number {
  const startedAtMs = new Date(startedAt).getTime();
  return Math.max(Math.floor((Date.now() - startedAtMs) / 1000), 0);
}

function calculateDecisionTotal(params: { allow: number; deny: number; throttle: number }): number {
  return params.allow + params.deny + params.throttle;
}

export async function registerRuntimeDashboardRoute(app: FastifyInstance): Promise<void> {
  app.get("/runtime/dashboard", async () => {
    const health = getRuntimeHealth();
    const metrics = getRuntimeMetrics();
    const snapshotCache = getRuntimeSnapshotCache();

    const totalDecisions = calculateDecisionTotal({
      allow: metrics.allowCount,
      deny: metrics.denyCount,
      throttle: metrics.throttleCount,
    });

    return {
      instance: {
        id: env.GATEWAY_INSTANCE_ID,
        service: "gatekeeper-gateway",
        status: health.status,
        uptime_seconds: calculateUptimeSeconds(metrics.startedAt),
      },
      snapshot: {
        status: snapshotCache.status,
        active_version: snapshotCache.activeSnapshot?.version ?? null,
        last_successful_refresh_at: snapshotCache.lastSuccessfulRefreshAt,
        last_failed_refresh_at: snapshotCache.lastFailedRefreshAt,
        refresh_count: snapshotCache.refreshCount,
        refresh_failure_count: snapshotCache.refreshFailureCount,
      },
      decisions: {
        total: totalDecisions,
        allow: metrics.allowCount,
        deny: metrics.denyCount,
        throttle: metrics.throttleCount,
      },
      enforcement: {
        rate_limit_exceeded: metrics.rateLimitExceededCount,
        quota_exceeded: metrics.quotaExceededCount,
      },
      dependencies: {
        redis_failure_count: metrics.redisFailureCount,
        health: health.dependencies,
      },
      tracing: {
        enabled: env.OTEL_TRACING_ENABLED,
        service_name: env.OTEL_SERVICE_NAME,
        exporter_endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
      },
      operational_summary: {
        runtime_ready: health.status !== "UNAVAILABLE" && snapshotCache.activeSnapshot !== null,
        using_last_known_good_snapshot:
          snapshotCache.status === "REFRESH_FAILED" || snapshotCache.status === "STALE",
        redis_degraded: health.dependencies.some(
          (dependency) => dependency.dependency === "redis" && dependency.status !== "HEALTHY",
        ),
      },
      integrity: getRuntimeIntegrityState(),
    };
  });
}
