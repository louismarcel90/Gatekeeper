import { gatewayConfig } from "../config/env";
import { fetchLatestSnapshot } from "./control-plane-client";
import { snapshotStore } from "./snapshot-store";

export async function loadSnapshotOnStartup(): Promise<void> {
  const snapshot = await fetchLatestSnapshot();

  if (!snapshot) {
    return;
  }

  snapshotStore.setSnapshot(snapshot);
}

export function startSnapshotPolling(): void {
  const intervalMs = gatewayConfig.snapshotPollIntervalMs;

  setInterval(async () => {
    try {
      const latestSnapshot = await fetchLatestSnapshot();

      if (!latestSnapshot) {
        return;
      }

      const currentVersion = snapshotStore.getVersion();

      if (currentVersion === null || latestSnapshot.version > currentVersion) {
        snapshotStore.setSnapshot(latestSnapshot);
      }
    } catch (error) {
      console.error("Snapshot polling failed:", error);
    }
  }, intervalMs);
}