import { env } from "../config/env";
import { loadRuntimeSnapshot } from "./load-runtime-snapshot";

export async function startSnapshotPoller() {
  await loadRuntimeSnapshot();

  setInterval(async () => {
    try {
      await loadRuntimeSnapshot();
    } catch (error) {
      console.error(
        "[gateway-runtime] snapshot refresh failed",
        error,
      );
    }
  }, env.SNAPSHOT_POLL_INTERVAL_MS);
}