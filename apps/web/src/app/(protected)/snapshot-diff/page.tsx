"use client";

import { useState } from "react";
import { PageHeader } from "../../../components/app-shell/page-header";
import { DataTable, DataTableRow } from "../../../components/data-display/data-table";
import { SectionCard } from "../../../components/data-display/section-card";
import { StatusBadge } from "../../../components/data-display/status-badge";
import { ActionButton } from "../../../components/controls/action-button";
import { InlineMessage } from "../../../components/feedback/inline-message";
import { PageStack } from "../../../components/page-layout/page-stack";
import { SystemPage } from "../../../components/page-layout/system-page";
import { useSnapshotDiff } from "@/src/modules/snapshots/use-snapshot-diff";

type SnapshotChangeType = "ADDED" | "REMOVED" | "MODIFIED";

type SnapshotChangedField = {
  field: string;
};

type RouteDiffEntry = {
  change_type: SnapshotChangeType;
  route_id: string;
  changed_fields: SnapshotChangedField[];
};

type PolicyDiffEntry = {
  change_type: SnapshotChangeType;
  policy_id: string;
  changed_fields: SnapshotChangedField[];
};

function parsePositiveInteger(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function getTone(changeType: "ADDED" | "REMOVED" | "MODIFIED") {
  if (changeType === "ADDED") {
    return "green";
  }

  if (changeType === "REMOVED") {
    return "red";
  }

  return "gold";
}

export default function SnapshotDiffPage() {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromVersion, setFromVersion] = useState<number | null>(null);
  const [toVersion, setToVersion] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const query = useSnapshotDiff({
    fromVersion,
    toVersion,
  });

  function handleCompare() {
    const parsedFrom = parsePositiveInteger(fromInput);
    const parsedTo = parsePositiveInteger(toInput);

    if (parsedFrom === null || parsedTo === null) {
      setMessage("Both snapshot versions must be positive integers.");
      return;
    }

    setMessage("");
    setFromVersion(parsedFrom);
    setToVersion(parsedTo);
  }

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Snapshot Diff"
          subtitle="Compare two published snapshots to review configuration changes before rollback or investigation."
        />

        {message ? <InlineMessage tone="error">{message}</InlineMessage> : null}

        <SectionCard title="Compare Snapshots">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              value={fromInput}
              onChange={(event) => setFromInput(event.target.value)}
              placeholder="From version"
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid #E7E5E4",
                background: "#FFFFFF",
              }}
            />

            <input
              value={toInput}
              onChange={(event) => setToInput(event.target.value)}
              placeholder="To version"
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid #E7E5E4",
                background: "#FFFFFF",
              }}
            />

            <ActionButton
              tone="violet"
              onClick={handleCompare}
              disabled={query.isFetching}
            >
              {query.isFetching ? "Comparing..." : "Compare"}
            </ActionButton>
          </div>
        </SectionCard>

        {query.isError ? (
          <InlineMessage tone="error">
            Snapshot diff failed. Check that both versions exist.
          </InlineMessage>
        ) : null}

        {query.data ? (
          <>
            <SectionCard title="Diff Summary">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <div>Total changes: {query.data.summary.total_changes}</div>
                <div>Routes added: {query.data.summary.routes_added}</div>
                <div>Routes removed: {query.data.summary.routes_removed}</div>
                <div>Routes modified: {query.data.summary.routes_modified}</div>
                <div>Policies added: {query.data.summary.policies_added}</div>
                <div>Policies removed: {query.data.summary.policies_removed}</div>
                <div>Policies modified: {query.data.summary.policies_modified}</div>
              </div>
            </SectionCard>

            <SectionCard title="Route Changes">
  {query.data.routes.length === 0 ? (
    <div style={{ color: "#6B665F" }}>No route changes.</div>
  ) : (
    <DataTable columns={["Change", "Route ID", "Fields"]}>
      {query.data.routes.map((entry: RouteDiffEntry) => (
        <DataTableRow
          key={`${entry.change_type}-${entry.route_id}`}
          columns={[
            <StatusBadge key="change" tone={getTone(entry.change_type)}>
              {entry.change_type}
            </StatusBadge>,
            entry.route_id,
            entry.changed_fields.length > 0
              ? entry.changed_fields.map((field) => field.field).join(", ")
              : "-",
          ]}
        />
      ))}
    </DataTable>
  )}
</SectionCard>

<SectionCard title="Policy Changes">
  {query.data.policies.length === 0 ? (
    <div style={{ color: "#6B665F" }}>No policy changes.</div>
  ) : (
    <DataTable columns={["Change", "Policy ID", "Fields"]}>
      {query.data.policies.map((entry: PolicyDiffEntry) => (
        <DataTableRow
          key={`${entry.change_type}-${entry.policy_id}`}
          columns={[
            <StatusBadge key="change" tone={getTone(entry.change_type)}>
              {entry.change_type}
            </StatusBadge>,
            entry.policy_id,
            entry.changed_fields.length > 0
              ? entry.changed_fields.map((field: SnapshotChangedField) => field.field).join(", ")
              : "-",
          ]}
        />
      ))}
    </DataTable>
  )}
</SectionCard>
          </>
        ) : null}
      </PageStack>
    </SystemPage>
  );
}