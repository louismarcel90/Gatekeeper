import { getLatestSnapshot } from "../infrastructure/snapshot-repository";
import { SimulationDecision } from "../domain/types";
import { SimulateDecisionInput } from "../domain/validators";
import { evaluateSimulation } from "../simulation/decision-engine";

export async function simulateDecision(input: SimulateDecisionInput): Promise<SimulationDecision> {
  const snapshot = await getLatestSnapshot();

  return evaluateSimulation(
    {
      path: input.path,
      method: input.method,
      client_id: input.client_id,
      scopes: input.scopes,
    },
    snapshot,
  );
}
