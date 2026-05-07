import { startSnapshotPoller } from "../snapshot/start-snapshot-poller";
import { startRuntimeHealthPoller } from "../runtime/start-runtime-health-poller";

export async function startRuntimeInfrastructure(): Promise<void> {
  await startSnapshotPoller();
  startRuntimeHealthPoller();

  console.log("[gateway-runtime] infrastructure ready");
}