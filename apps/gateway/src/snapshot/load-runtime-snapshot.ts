import axios from "axios";
import { env } from "../config/env";
import { Snapshot } from "../core/types";
import {
  markSnapshotRefreshFailed,
  setRuntimeSnapshot,
} from "./runtime-snapshot-store";
import {
  recordSnapshotRefreshFailure,
  recordSnapshotRefreshSuccess,
} from "../observability/runtime-metrics";

type SnapshotApiResponse = Snapshot;

function extractErrorMessage(error: Error): string {
  return error.message;
}

export async function loadRuntimeSnapshot(): Promise<Snapshot> {
  try {
    const response = await axios.get<SnapshotApiResponse>(
      `${env.CONTROL_PLANE_BASE_URL}/snapshots/active`,
      {
        timeout: 3000,
      },
    );

    setRuntimeSnapshot(response.data);
    recordSnapshotRefreshSuccess();

    console.log(
      `[gateway-runtime] snapshot loaded version=${response.data.version}`,
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? extractErrorMessage(error)
        : "Snapshot refresh failed.";

    markSnapshotRefreshFailed(message);
    recordSnapshotRefreshFailure();
    

    console.error("[gateway-runtime] snapshot refresh failed", message);

    throw new Error(message);
  }
}