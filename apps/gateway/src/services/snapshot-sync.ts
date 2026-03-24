import { fetchLatestSnapshot } from "./control-plane-client";
import { snapshotStore } from "./snapshot-store";

export async function loadSnapshotOnStartup(): Promise<void> {
  const snapshot = await fetchLatestSnapshot();

  if (!snapshot) {
    return;
  }

  snapshotStore.setSnapshot(snapshot);
}