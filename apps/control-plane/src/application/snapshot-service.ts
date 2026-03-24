import { Snapshot } from "../domain/types";
import { getAllPolicies } from "../infrastructure/policy-repository";
import { getAllRoutes } from "../infrastructure/route-repository";
import {
  getLatestSnapshot as getLatestSnapshotFromDb,
  getNextSnapshotVersion,
  insertSnapshot,
} from "../infrastructure/snapshot-repository";

export async function publishSnapshot(): Promise<Snapshot> {
  const routes = await getAllRoutes();
  const policies = await getAllPolicies();
  const version = await getNextSnapshotVersion();

  const snapshot: Snapshot = {
    version,
    generated_at: new Date().toISOString(),
    routes,
    policies,
  };

  return insertSnapshot(snapshot);
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  return getLatestSnapshotFromDb();
}