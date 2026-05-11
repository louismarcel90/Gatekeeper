import axios from "axios";
import { env } from "../config/env";
import { Snapshot } from "../core/types";
import {
  recordSnapshotRefreshFailure,
  recordSnapshotRefreshSuccess,
} from "../observability/runtime-metrics";
import {
  getRuntimeIntegrityState,
  setRuntimeIntegrityState,
} from "../runtime/runtime-integrity-state";
import { verifySnapshotIntegrity } from "../runtime/verify-snapshot-integrity";
import {
  markSnapshotRefreshFailed,
  setRuntimeSnapshot,
} from "./runtime-snapshot-store";

type SnapshotApiResponse = Snapshot;

function extractErrorMessage(error: Error): string {
  return error.message;
}

function verifyAndStoreSnapshot(snapshot: Snapshot): void {
  const integrityVerified = verifySnapshotIntegrity(snapshot);

  if (!integrityVerified) {
    setRuntimeIntegrityState({
      verified: false,
      verifiedAt: new Date().toISOString(),
      activeSnapshotHash: null,
      failureReason: "Snapshot integrity verification failed.",
    });

    throw new Error("Runtime snapshot integrity verification failed.");
  }

  setRuntimeIntegrityState({
    verified: true,
    verifiedAt: new Date().toISOString(),
    activeSnapshotHash: snapshot.integrity.hash,
    failureReason: null,
  });

  setRuntimeSnapshot(snapshot);
}

export async function loadRuntimeSnapshot(): Promise<Snapshot> {
  try {
    const response = await axios.get<SnapshotApiResponse>(
      `${env.CONTROL_PLANE_BASE_URL}/snapshots/active`,
      {
        timeout: 3000,
      },
    );

    verifyAndStoreSnapshot(response.data);

    recordSnapshotRefreshSuccess();

    console.log(
      `[gateway-runtime] snapshot loaded version=${response.data.version}`,
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error ? extractErrorMessage(error) : "Snapshot refresh failed.";

    markSnapshotRefreshFailed(message);
    recordSnapshotRefreshFailure();

    const currentIntegrityState = getRuntimeIntegrityState();

    if (!currentIntegrityState.verified) {
      console.error(
        "[gateway-runtime] snapshot integrity state degraded",
        currentIntegrityState.failureReason,
      );
    }

    console.error("[gateway-runtime] snapshot refresh failed", message);

    throw new Error(message);
  }
}