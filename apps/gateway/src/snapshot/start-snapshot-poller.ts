import { env } from "../config/env";
import { runtimeLogger } from "../observability/runtime-logger";
import { hasRuntimeSnapshot } from "./runtime-snapshot-store";
import { loadRuntimeSnapshot } from "./load-runtime-snapshot";

export async function startSnapshotPoller(): Promise<void> {
  runtimeLogger.info("Starting runtime snapshot poller.", {
    snapshot_poll_interval_ms: env.SNAPSHOT_POLL_INTERVAL_MS,
  });

  try {
    await loadRuntimeSnapshot();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Initial snapshot load failed.";

    runtimeLogger.error("Initial runtime snapshot load failed.", {
      error_message: message,
    });
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
      runtimeLogger.warn(
        "Snapshot refresh failed, keeping last known good snapshot.",
        {
          error_message: message,
        },
      );
      return;
    }

    runtimeLogger.error(
      "Snapshot refresh failed and no cached snapshot exists.",
      {
        error_message: message,
      },
    );
  }
}