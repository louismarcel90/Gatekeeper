import {
  PolicyDocument,
  SimulationDecision,
  SimulationInput,
  Snapshot,
} from "../domain/types";
import { evaluateSimulation } from "../simulation/decision-engine";

function buildSnapshotFromDocument(document: PolicyDocument): Snapshot {
  return {
    version: document.version,
    generated_at: new Date().toISOString(),
    routes: document.routes,
    policies: document.policies,
  };
}

export function simulateCandidateDecision(params: {
  document: PolicyDocument;
  input: SimulationInput;
}): SimulationDecision {
  const snapshot = buildSnapshotFromDocument(params.document);

  return evaluateSimulation(params.input, snapshot);
}