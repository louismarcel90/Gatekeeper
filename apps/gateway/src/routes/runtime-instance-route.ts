import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeHealth } from "../runtime/runtime-health-registry";
import { getRuntimeSnapshotCache } from "../snapshot/runtime-snapshot-store";

export async function registerRuntimeInstanceRoute(app: FastifyInstance): Promise<void> {
  app.get("/runtime/instance", async () => {
    const health = getRuntimeHealth();
    const snapshotCache = getRuntimeSnapshotCache();

    return {
      instance_id: env.GATEWAY_INSTANCE_ID,
      service: "gatekeeper-gateway",
      status: health.status,
      active_snapshot_version: snapshotCache.activeSnapshot?.version ?? null,
      snapshot_status: snapshotCache.status,
      started_with_consistency_model: "EVENTUAL_RUNTIME_CONSISTENCY",
      scaling_role: "HORIZONTAL_GATEWAY_INSTANCE",
      shared_runtime_dependencies: ["redis"],
      local_runtime_state: ["snapshot-cache", "runtime-health-registry", "runtime-metrics"],
      tracing: {
        enabled: env.OTEL_TRACING_ENABLED,
        service_name: env.OTEL_SERVICE_NAME,
        exporter_endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
      },
    };
  });
}
