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

export async function publishSnapshot(): Promise<Snapshot> {
  const routes = await getAllRoutes();
  const policies = await getAllPolicies();
  const version = await getNextSnapshotVersion();
  const currentActive = await getActiveSnapshotFromDb();

  const snapshot: Snapshot = {
    version,
    generated_at: new Date().toISOString(),
    routes,
    policies,
    is_active: currentActive === null,
  };

  const inserted = await insertSnapshot(snapshot);

  await insertDeploymentHistoryEntry({
    snapshot_version: inserted.version,
    action: "PUBLISH",
  });

  if (inserted.is_active) {
    await insertDeploymentHistoryEntry({
      snapshot_version: inserted.version,
      action: "ACTIVATE",
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

export async function activateSnapshotVersion(version: number): Promise<Snapshot> {
  const snapshot = await getSnapshotByVersion(version);

  if (!snapshot) {
    throw new Error(`Snapshot version "${version}" was not found.`);
  }

  await activateSnapshot(version);

  await insertDeploymentHistoryEntry({
    snapshot_version: version,
    action: "ACTIVATE",
  });

  return {
    ...snapshot,
    is_active: true,
  };
}

export async function rollbackToSnapshotVersion(version: number): Promise<Snapshot> {
  const snapshot = await getSnapshotByVersion(version);

  if (!snapshot) {
    throw new Error(`Snapshot version "${version}" was not found.`);
  }

  await activateSnapshot(version);

  await insertDeploymentHistoryEntry({
    snapshot_version: version,
    action: "ROLLBACK",
  });

  return {
    ...snapshot,
    is_active: true,
  };
}