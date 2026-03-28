"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { InlineMessage } from "@/src/components/feedback/inline-message";
import { CapabilityHint } from "@/src/components/feedback/capability-hint";
import { ActionButton } from "@/src/components/controls/action-button";
import { PageContainer } from "@/src/components/page-layout/page-container";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { PageTwoPane } from "@/src/components/page-layout/page-two-pane";
import { useSimulateDecision } from "@/src/modules/simulation/use-simulate-decision";
import { useCandidateSimulation } from "@/src/modules/simulation/use-candidate-simulation";
import { useCapability } from "@/src/modules/permissions/use-capability";

export default function SimulationPage() {
  const simulateMutation = useSimulateDecision();
  const candidateMutation = useCandidateSimulation();

  const [path, setPath] = useState("/search");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">("GET");
  const [clientId, setClientId] = useState("partner-x");
  const [scopes, setScopes] = useState("search:read");
  const [candidateDocument, setCandidateDocument] = useState("");

  const canCandidateSimulate = useCapability("simulation.candidate");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await simulateMutation.mutateAsync({
      path,
      method,
      client_id: clientId || undefined,
      scopes: scopes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  async function handleCandidateSimulation() {
    try {
      const parsedDocument = JSON.parse(candidateDocument);

      await candidateMutation.mutateAsync({
        document: parsedDocument,
        input: {
          path,
          method,
          client_id: clientId || undefined,
          scopes: scopes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      });
    } catch {
      // handled below
    }
  }

  const result = candidateMutation.data ?? simulateMutation.data;
  const resultError =
    candidateMutation.isError || simulateMutation.isError
      ? "Simulation failed. Check input values or candidate document JSON."
      : "";

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          title="Simulation"
          subtitle="Preview runtime decisions before changing traffic behavior in production."
        />

        {resultError ? <InlineMessage tone="error">{resultError}</InlineMessage> : null}

        {!canCandidateSimulate ? (
          <CapabilityHint>
            Your role can run runtime simulation, but candidate simulation requires a security or
            admin role.
          </CapabilityHint>
        ) : null}

        <PageTwoPane
          left={
            <SectionCard title="Simulation Input">
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="Path"
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #E7E5E4",
                    background: "#FFFFFF",
                  }}
                />

                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value as "GET" | "POST" | "PUT" | "PATCH" | "DELETE")
                  }
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #E7E5E4",
                    background: "#FFFFFF",
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Client ID"
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #E7E5E4",
                    background: "#FFFFFF",
                  }}
                />

                <input
                  value={scopes}
                  onChange={(e) => setScopes(e.target.value)}
                  placeholder="Scopes (comma separated)"
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #E7E5E4",
                    background: "#FFFFFF",
                  }}
                />

                <ActionButton type="submit" tone="violet" disabled={simulateMutation.isPending}>
                  {simulateMutation.isPending ? "Simulating..." : "Run Runtime Simulation"}
                </ActionButton>
              </form>

              {canCandidateSimulate ? (
                <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111111" }}>
                    Candidate Policy Document
                  </div>

                  <textarea
                    value={candidateDocument}
                    onChange={(e) => setCandidateDocument(e.target.value)}
                    placeholder="Paste candidate policy document JSON here..."
                    style={{
                      minHeight: 180,
                      padding: 14,
                      borderRadius: 14,
                      border: "1px solid #E7E5E4",
                      background: "#FFFFFF",
                      color: "#111111",
                      resize: "vertical",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 13,
                      lineHeight: 1.55,
                    }}
                  />

                  <ActionButton
                    tone="gold"
                    onClick={handleCandidateSimulation}
                    disabled={candidateMutation.isPending}
                  >
                    {candidateMutation.isPending
                      ? "Running candidate simulation..."
                      : "Run Candidate Simulation"}
                  </ActionButton>
                </div>
              ) : null}
            </SectionCard>
          }
          right={
            <SectionCard title="Simulation Result">
              {!result ? (
                <div style={{ color: "#6B665F" }}>
                  Run a simulation to inspect the expected decision.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <StatusBadge
                      tone={
                        result.decision === "ALLOW"
                          ? "green"
                          : result.decision === "THROTTLE"
                            ? "gold"
                            : "red"
                      }
                    >
                      {result.decision}
                    </StatusBadge>
                  </div>

                  <div>
                    <strong>Reason:</strong> {result.reason_code}
                  </div>
                  <div>
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                  <div>
                    <strong>Route ID:</strong> {result.route_id ?? "—"}
                  </div>
                  <div>
                    <strong>Policy ID:</strong> {result.policy_id ?? "—"}
                  </div>
                  <div>
                    <strong>Snapshot:</strong> {result.snapshot_version ?? "—"}
                  </div>
                </div>
              )}
            </SectionCard>
          }
        />
      </PageStack>
    </PageContainer>
  );
}
