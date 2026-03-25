import { DeploymentHistoryEntry } from "../domain/types";
import { listDeploymentHistory } from "../infrastructure/deployment-repository";

export async function getDeploymentHistory(): Promise<DeploymentHistoryEntry[]> {
  return listDeploymentHistory();
}