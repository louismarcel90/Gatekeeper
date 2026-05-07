import { FastifyInstance } from "fastify";
import { getRuntimeSnapshotCache } from "../snapshot/runtime-snapshot-store";

export async function registerRuntimeSnapshotRoute(
  app: FastifyInstance,
): Promise<void> {
  app.get("/runtime/snapshot", async () => {
    const cache = getRuntimeSnapshotCache();

    return {
      status: cache.status,
      active_snapshot_version: cache.activeSnapshot?.version ?? null,
      last_loaded_at: cache.lastLoadedAt,
      last_successful_refresh_at: cache.lastSuccessfulRefreshAt,
      last_failed_refresh_at: cache.lastFailedRefreshAt,
      last_error_message: cache.lastErrorMessage,
      refresh_count: cache.refreshCount,
      refresh_failure_count: cache.refreshFailureCount,
    };
  });
}