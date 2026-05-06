import { startSnapshotPoller } from "../snapshot/start-snapshot-poller";

export async function startRuntimeInfrastructure() {
  await startSnapshotPoller();

  console.log("[gateway-runtime] infrastructure ready");
}