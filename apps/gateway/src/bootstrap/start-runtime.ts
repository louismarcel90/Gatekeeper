import { runtimeLogger } from "../observability/runtime-logger";
import { startSnapshotPoller } from "../snapshot/start-snapshot-poller";
import { startRuntimeHealthPoller } from "../runtime/start-runtime-health-poller";

export async function startRuntimeInfrastructure(): Promise<void> {
  await startSnapshotPoller();
  startRuntimeHealthPoller();

  runtimeLogger.info("Gateway runtime infrastructure ready.");
}