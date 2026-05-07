import { env } from "../config/env";
import { hasRuntimeSnapshot } from "./runtime-snapshot-store";
import { loadRuntimeSnapshot } from "./load-runtime-snapshot";

export async function startSnapshotPoller(): Promise<void> {
  try {
    await loadRuntimeSnapshot();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Initial snapshot load failed.";

    console.error("[gateway-runtime] initial snapshot load failed", message);
  }

  setInterval(() => {
    void refreshSnapshotSafely();
  }, env.SNAPSHOT_POLL_INTERVAL_MS);
}

async function refreshSnapshotSafely(): Promise<void> {
  try {
    await loadRuntimeSnapshot();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Snapshot refresh failed.";

    if (hasRuntimeSnapshot()) {
      console.warn(
        "[gateway-runtime] snapshot refresh failed, keeping last known good snapshot",
        message,
      );
      return;
    }

    console.error(
      "[gateway-runtime] snapshot refresh failed and no cached snapshot exists",
      message,
    );
  }
}