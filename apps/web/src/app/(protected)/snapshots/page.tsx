"use client";

import { useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from "@/src/components/data-display/data-table";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { EmptyState } from "@/src/components/feedback/empty-sate";
import { InlineMessage } from "@/src/components/feedback/inline-message";
import { CapabilityHint } from "@/src/components/feedback/capability-hint";
import { ActionButton } from "@/src/components/controls/action-button";
import { SystemPage } from "@/src/components/page-layout/system-page";
import { PageStack } from "@/src/components/page-layout/page-stack";
import {
  useActivateSnapshot,
  usePublishSnapshot,
  useRollbackSnapshot,
  useSnapshots,
} from "@/src/modules/snapshots/use-snapshots";
import { useCapability } from "@/src/modules/permissions/use-capability";

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

  const canPublish = useCapability("snapshots.publish");
  const canActivate = useCapability("snapshots.activate");
  const canRollback = useCapability("snapshots.rollback");

  const [message, setMessage] = useState<string>("");

  const items = (query.data ?? []) as SnapshotItem[];

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
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Snapshots"
          subtitle="Review published configuration snapshots, publish new ones, and safely activate or rollback versions."
          action={
            canPublish ? (
              <ActionButton
                tone="violet"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? "Publishing..." : "Publish Snapshot"}
              </ActionButton>
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

        {!canPublish && !canActivate && !canRollback ? (
          <CapabilityHint>
            Your role is read-only on snapshots. You can inspect configuration history, but
            you cannot publish, activate, or rollback versions.
          </CapabilityHint>
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
                      <StatusBadge key={`status-${item.version}`} tone="violet">Active</StatusBadge>
                    ) : (
                      <StatusBadge key={`status-${item.version}`}>Inactive</StatusBadge>
                    ),
                    <div key={`status-${item.version}`} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <ActionButton
                        
                        tone="violet"
                        onClick={() => handleActivate(item.version)}
                        disabled={!canActivate || activateMutation.isPending || item.is_active}
                      >
                        Activate
                      </ActionButton>

                      <ActionButton
                        tone="gold"
                        onClick={() => handleRollback(item.version)}
                        disabled={!canRollback || rollbackMutation.isPending}
                      >
                        Rollback
                      </ActionButton>
                    </div>,
                  ]}
                />
              ))}
            </DataTable>
          )}
        </SectionCard>
      </PageStack>
    </SystemPage>
  );
}