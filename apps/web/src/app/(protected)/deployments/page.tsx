"use client";

import { useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from "@/src/components/data-display/data-table";
import {
  FilterSelect,
  FiltersBar,
} from "@/src/components/data-display/filters-bar";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { EmptyState } from "@/src/components/feedback/empty-sate"; 
import { PageContainer } from "@/src/components/page-layout/page-container";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { useDeployments } from "@/src/modules/deployments/use-deployments";

type DeploymentItem = {
  id: string;
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
  created_at: string;
};

export default function DeploymentsPage() {
  const [action, setAction] = useState("");
  const query = useDeployments({
    action: action || undefined,
  });

  const items = (query.data ?? []) as DeploymentItem[];

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          title="Deployments"
          subtitle="Review publishes, activations, and rollbacks across snapshot history."
        />

        <SectionCard title="Deployment History">
          <FiltersBar>
            <FilterSelect value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="">All actions</option>
              <option value="PUBLISH">PUBLISH</option>
              <option value="ACTIVATE">ACTIVATE</option>
              <option value="ROLLBACK">ROLLBACK</option>
            </FilterSelect>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading deployment history...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load deployment history.</div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No deployment events found"
              description="Publish or activate a snapshot to populate deployment history."
            />
          ) : (
            <DataTable columns={["Action", "Snapshot", "Created At"]}>
              {items.map((item) => (
                <DataTableRow
                  key={item.id}
                  columns={[
                    <StatusBadge
                      key="status"
                      tone={
                        item.action === "ACTIVATE"
                          ? "violet"
                          : item.action === "ROLLBACK"
                            ? "gold"
                            : "neutral"
                      }
                    >
                      {item.action}
                    </StatusBadge>,
                    `v${item.snapshot_version}`,
                    new Date(item.created_at).toLocaleString(),
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