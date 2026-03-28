import { gatewayConfig } from "../config/env";
import { fetchActiveSnapshot } from "./control-plane-client";
import { snapshotStore } from "./snapshot-store";

export async function loadSnapshotOnStartup(): Promise<void> {
  const snapshot = await fetchActiveSnapshot();

  if (!snapshot) {
    return;
  }

  snapshotStore.setSnapshot(snapshot);
}

export function startSnapshotPolling(): void {
  const intervalMs = gatewayConfig.snapshotPollIntervalMs;

  setInterval(async () => {
    try {
      const activeSnapshot = await fetchActiveSnapshot();

      if (!activeSnapshot) {
        return;
      }

      const currentVersion = snapshotStore.getVersion();

      if (currentVersion === null || activeSnapshot.version !== currentVersion) {
        snapshotStore.setSnapshot(activeSnapshot);
      }
    } catch (error) {
      console.error("Snapshot polling failed:", error);
    }
  }, intervalMs);
}
