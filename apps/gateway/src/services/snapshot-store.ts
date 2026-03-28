import { Snapshot } from "../core/types";

class SnapshotStore {
  private snapshot: Snapshot | null = null;

  getSnapshot(): Snapshot | null {
    return this.snapshot;
  }

  setSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
  }

  hasSnapshot(): boolean {
    return this.snapshot !== null;
  }

  getVersion(): number | null {
    return this.snapshot?.version ?? null;
  }
}

export const snapshotStore = new SnapshotStore();
