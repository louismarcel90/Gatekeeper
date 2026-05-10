import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeSnapshotCache } from "../snapshot/runtime-snapshot-store";

export async function registerRuntimeConsistencyRoute(app: FastifyInstance): Promise<void> {
  app.get("/runtime/consistency", async () => {
    const snapshotCache = getRuntimeSnapshotCache();

    return {
      model: "EVENTUAL_RUNTIME_CONSISTENCY",
      enforcement_source: "LAST_SUCCESSFULLY_LOADED_ACTIVE_SNAPSHOT",
      snapshot_status: snapshotCache.status,
      active_snapshot_version: snapshotCache.activeSnapshot?.version ?? null,
      refresh_interval_ms: env.SNAPSHOT_POLL_INTERVAL_MS,
      guarantees: [
        "Gateway does not enforce live mutable control-plane state.",
        "Gateway keeps the last known good snapshot during control-plane failures.",
        "Runtime decisions include the snapshot version used for evaluation.",
        "A failed refresh does not replace the active runtime snapshot.",
      ],
      trade_offs: [
        "Configuration changes are not instantly visible at runtime.",
        "Runtime may temporarily enforce a stale but valid snapshot.",
        "Operators must account for snapshot propagation delay.",
      ],
    };
  });
}
