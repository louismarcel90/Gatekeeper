import { DeploymentHistoryEntry } from "../domain/types";
import { DeploymentHistoryQueryInput } from "../domain/validators";
import { listDeploymentHistory } from "../infrastructure/deployment-repository";

export async function getDeploymentHistory(
  filters: DeploymentHistoryQueryInput,
): Promise<DeploymentHistoryEntry[]> {
  return listDeploymentHistory(filters);
}