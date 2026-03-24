import { Snapshot } from "../domain/types";
import { store } from "../infrastructure/store";

export function publishSnapshot(): Snapshot {
  const snapshot: Snapshot = {
    version: store.getNextSnapshotVersion(),
    generated_at: new Date().toISOString(),
    routes: store.getRoutes(),
    policies: store.getPolicies()
  };

  return store.addSnapshot(snapshot);
}

export function getLatestSnapshot(): Snapshot | null {
  return store.getLatestSnapshot();
}