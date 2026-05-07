import { RuntimePolicy, RuntimeRoute } from "../runtime/runtime-types";
import { setDependencyStatus } from "../runtime/runtime-health-registry";

export type ActiveRuntimeSnapshot = {
  version: number;
  routes: RuntimeRoute[];
  policies: RuntimePolicy[];
  loadedAt: string;
};

let activeSnapshot: ActiveRuntimeSnapshot | null = null;

export function setActiveSnapshot(snapshot: ActiveRuntimeSnapshot) {
  activeSnapshot = snapshot;
}

export function getActiveSnapshot(): ActiveRuntimeSnapshot {
  if (!activeSnapshot) {
    throw new Error("No active runtime snapshot loaded.");
  }

  return activeSnapshot;
}import { Snapshot } from "../core/types";

export type RuntimeSnapshotCacheStatus =
  | "EMPTY"
  | "READY"
  | "STALE"
  | "REFRESH_FAILED";

export type RuntimeSnapshotCache = {
  status: RuntimeSnapshotCacheStatus;
  activeSnapshot: Snapshot | null;
  lastLoadedAt: string | null;
  lastSuccessfulRefreshAt: string | null;
  lastFailedRefreshAt: string | null;
  lastErrorMessage: string | null;
  refreshCount: number;
  refreshFailureCount: number;
};

const cache: RuntimeSnapshotCache = {
  status: "EMPTY",
  activeSnapshot: null,
  lastLoadedAt: null,
  lastSuccessfulRefreshAt: null,
  lastFailedRefreshAt: null,
  lastErrorMessage: null,
  refreshCount: 0,
  refreshFailureCount: 0,
};

export function setRuntimeSnapshot(snapshot: Snapshot): void {
  const now = new Date().toISOString();

  cache.status = "READY";
  cache.activeSnapshot = snapshot;
  cache.lastLoadedAt = now;
  cache.lastSuccessfulRefreshAt = now;
  cache.lastErrorMessage = null;
  cache.refreshCount += 1;

  setDependencyStatus({
  dependency: "snapshot-cache",
  status: "HEALTHY",
  reason: `Snapshot version ${snapshot.version} loaded successfully.`,
});
}

export function markSnapshotRefreshFailed(errorMessage: string): void {
  const now = new Date().toISOString();

  cache.status = cache.activeSnapshot ? "REFRESH_FAILED" : "EMPTY";
  cache.lastFailedRefreshAt = now;
  cache.lastErrorMessage = errorMessage;
  cache.refreshFailureCount += 1;

  setDependencyStatus({
  dependency: "control-plane",
  status: "DEGRADED",
  reason: errorMessage,
});

setDependencyStatus({
  dependency: "snapshot-cache",
  status: cache.activeSnapshot ? "DEGRADED" : "UNAVAILABLE",
  reason: cache.activeSnapshot
    ? "Snapshot refresh failed, using last known good snapshot."
    : "No runtime snapshot available.",
});
}

export function markSnapshotStale(): void {
  if (!cache.activeSnapshot) {
    cache.status = "EMPTY";
    return;
  }

  cache.status = "STALE";
}

export function getRuntimeSnapshot(): Snapshot {
  if (!cache.activeSnapshot) {
    throw new Error("No active runtime snapshot is available.");
  }

  return cache.activeSnapshot;
}

export function getRuntimeSnapshotCache(): RuntimeSnapshotCache {
  return {
    status: cache.status,
    activeSnapshot: cache.activeSnapshot,
    lastLoadedAt: cache.lastLoadedAt,
    lastSuccessfulRefreshAt: cache.lastSuccessfulRefreshAt,
    lastFailedRefreshAt: cache.lastFailedRefreshAt,
    lastErrorMessage: cache.lastErrorMessage,
    refreshCount: cache.refreshCount,
    refreshFailureCount: cache.refreshFailureCount,
  };
}

export function hasRuntimeSnapshot(): boolean {
  return cache.activeSnapshot !== null;
}