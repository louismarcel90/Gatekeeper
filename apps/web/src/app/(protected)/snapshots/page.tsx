"use client";

import { useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from "@/src/components/data-display/data-table";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { EmptyState } from "@/src/components/feedback/empty-sate";
import { InlineMessage } from "@/src/components/feedback/inline-message";
import { PageContainer } from "@/src/components/page-layout/page-container";
import { PageStack } from "@/src/components/page-layout/page-stack";
import {
  useActivateSnapshot,
  usePublishSnapshot,
  useRollbackSnapshot,
  useSnapshots,
} from "@/src/modules/snapshots/use-snapshots";
import { useAuthStore } from "@/src/core/state/auth-store";

type SnapshotItem = {
  version: number;
  generated_at: string;
  is_active?: boolean;
};

export default function SnapshotsPage() {
  const query = useSnapshots();
  const publishMutation = usePublishSnapshot();
  const activateMutation = useActivateSnapshot();
  const rollbackMutation = useRollbackSnapshot();
  const user = useAuthStore((state) => state.user);

  const [message, setMessage] = useState<string>("");

  const items = (query.data ?? []) as SnapshotItem[];

  const canPublish = user?.role === "security" || user?.role === "admin";
  const canAdmin = user?.role === "admin";

  async function handlePublish() {
    setMessage("");
    try {
      const created = await publishMutation.mutateAsync();
      setMessage(`Snapshot v${created.version} published successfully.`);
    } catch {
      setMessage("Failed to publish snapshot.");
    }
  }

  async function handleActivate(version: number) {
    setMessage("");
    try {
      await activateMutation.mutateAsync(version);
      setMessage(`Snapshot v${version} activated successfully.`);
    } catch {
      setMessage(`Failed to activate snapshot v${version}.`);
    }
  }

  async function handleRollback(version: number) {
    setMessage("");
    try {
      await rollbackMutation.mutateAsync(version);
      setMessage(`Rollback to snapshot v${version} completed successfully.`);
    } catch {
      setMessage(`Failed to rollback to snapshot v${version}.`);
    }
  }

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          title="Snapshots"
          subtitle="Review published configuration snapshots, publish new ones, and safely activate or rollback versions."
          action={
            canPublish ? (
              <button
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #D9D5FF",
                  background: "#F7F6FF",
                  color: "#5B57D6",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {publishMutation.isPending ? "Publishing..." : "Publish Snapshot"}
              </button>
            ) : null
          }
        />

        {message ? (
          <InlineMessage
            tone={message.toLowerCase().includes("failed") ? "error" : "success"}
          >
            {message}
          </InlineMessage>
        ) : null}

        <SectionCard title="Snapshot History">
          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading snapshots...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load snapshots.</div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No snapshots yet"
              description="Publish a snapshot from the control plane to start deployment-safe configuration history."
            />
          ) : (
            <DataTable columns={["Version", "Generated At", "Status", "Actions"]}>
              {items.map((item) => (
                <DataTableRow
  key={item.version}
  columns={[
    `v${item.version}`,
    new Date(item.generated_at).toLocaleString(),
    item.is_active ? (
      <StatusBadge key={`status-${item.version}`} tone="violet">
        Active
      </StatusBadge>
    ) : (
      <StatusBadge key={`status-${item.version}`}>Inactive</StatusBadge>
    ),
    <div
      key={`actions-${item.version}`}
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      {canAdmin ? (
        <button
          onClick={() => handleActivate(item.version)}
          disabled={activateMutation.isPending}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #D9D5FF",
            background: "#F7F6FF",
            color: "#5B57D6",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Activate
        </button>
      ) : null}

      {canAdmin ? (
        <button
          onClick={() => handleRollback(item.version)}
          disabled={rollbackMutation.isPending}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #E8D3B7",
            background: "#FBF7F2",
            color: "#9A6A2C",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Rollback
        </button>
      ) : null}
    </div>,
  ]}
/>
              ))}
            </DataTable>
          )}
        </SectionCard>
      </PageStack>
    </PageContainer>
  );
}