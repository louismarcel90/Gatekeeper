import { Snapshot } from "../domain/types";
import { insertDeploymentHistoryEntry } from "../infrastructure/deployment-repository";
import { getAllPolicies } from "../infrastructure/policy-repository";
import { getAllRoutes } from "../infrastructure/route-repository";
import {
  activateSnapshot,
  getActiveSnapshot as getActiveSnapshotFromDb,
  getLatestSnapshot as getLatestSnapshotFromDb,
  getNextSnapshotVersion,
  getSnapshotByVersion,
  insertSnapshot,
  listSnapshots as listSnapshotsFromDb,
} from "../infrastructure/snapshot-repository";
import { createSnapshotHash } from "../snapshots/create-snapshot-hash";

type ActionContext = {
  request_id?: string | null;
  actor_user_id?: string | null;
  actor_email?: string | null;
};

export async function publishSnapshot(context?: ActionContext): Promise<Snapshot> {
  const routes = await getAllRoutes();
  const policies = await getAllPolicies();
  const version = await getNextSnapshotVersion();
  const currentActive = await getActiveSnapshotFromDb();

  const generatedAt = new Date().toISOString();

const snapshotPayload = {
  version,
  generated_at: generatedAt,
  routes,
  policies,
};

const integrity = {
  algorithm: "sha256" as const,
  hash: createSnapshotHash(snapshotPayload),
  generated_at: new Date().toISOString(),
};

const snapshot: Snapshot = {
  ...snapshotPayload,
  integrity,
  is_active: currentActive === null,
};

  const inserted = await insertSnapshot(snapshot);

  await insertDeploymentHistoryEntry({
    snapshot_version: inserted.version,
    action: "PUBLISH",
    request_id: context?.request_id ?? null,
    actor_user_id: context?.actor_user_id ?? null,
    actor_email: context?.actor_email ?? null,
  });

  if (inserted.is_active) {
    await insertDeploymentHistoryEntry({
      snapshot_version: inserted.version,
      action: "ACTIVATE",
      request_id: context?.request_id ?? null,
      actor_user_id: context?.actor_user_id ?? null,
      actor_email: context?.actor_email ?? null,
    });
  }

  return inserted;
}

export async function listSnapshots(): Promise<Snapshot[]> {
  return listSnapshotsFromDb();
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  return getLatestSnapshotFromDb();
}

export async function getActiveSnapshot(): Promise<Snapshot | null> {
  return getActiveSnapshotFromDb();
}

export async function activateSnapshotVersion(
  version: number,
  context?: ActionContext,
): Promise<Snapshot> {
  const snapshot = await getSnapshotByVersion(version);

  if (!snapshot) {
    throw new Error(`Snapshot version "${version}" was not found.`);
  }

  await activateSnapshot(version);

  await insertDeploymentHistoryEntry({
    snapshot_version: version,
    action: "ACTIVATE",
    request_id: context?.request_id ?? null,
    actor_user_id: context?.actor_user_id ?? null,
    actor_email: context?.actor_email ?? null,
  });

  return {
    ...snapshot,
    is_active: true,
  };
}

export async function rollbackToSnapshotVersion(
  version: number,
  context?: ActionContext,
): Promise<Snapshot> {
  const snapshot = await getSnapshotByVersion(version);

  if (!snapshot) {
    throw new Error(`Snapshot version "${version}" was not found.`);
  }

  await activateSnapshot(version);

  await insertDeploymentHistoryEntry({
    snapshot_version: version,
    action: "ROLLBACK",
    request_id: context?.request_id ?? null,
    actor_user_id: context?.actor_user_id ?? null,
    actor_email: context?.actor_email ?? null,
  });

  return {
    ...snapshot,
    is_active: true,
  };
}
