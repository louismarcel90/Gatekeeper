import {
  PolicyDocument,
  SimulationDecision,
  SimulationInput,
  Snapshot,
} from "../domain/types";

import { evaluateSimulation } from "../simulation/decision-engine";
import { createSnapshotHash } from "../snapshots/create-snapshot-hash";

function buildSnapshotFromDocument(document: PolicyDocument): Snapshot {
  const generatedAt = new Date().toISOString();

  const snapshotPayload = {
    version: document.version,
    generated_at: generatedAt,
    routes: document.routes,
    policies: document.policies,
  };

  return {
    ...snapshotPayload,
    integrity: {
      algorithm: "sha256",
      hash: createSnapshotHash(snapshotPayload),
      generated_at: generatedAt,
    },
    is_active: true,
  };
}

export function simulateCandidateDecision(params: {
  document: PolicyDocument;
  input: SimulationInput;
}): SimulationDecision {
  const snapshot = buildSnapshotFromDocument(params.document);

  return evaluateSimulation(params.input, snapshot);
}