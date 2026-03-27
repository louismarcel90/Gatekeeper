"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from "@/src/components/data-display/data-table";
import {
  FilterInput,
  FilterSelect,
  FiltersBar,
} from "@/src/components/data-display/filters-bar";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { EmptyState } from "@/src/components/feedback/empty-sate";
import { SystemPage } from "@/src/components/page-layout/system-page";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { TableToolbar } from "@/src/components/data-explorer/table-toolbar";
import { PaginationControls } from "@/src/components/data-explorer/pagination-controls";
import { DetailPanel } from "@/src/components/data-explorer/detail-panel";
import { DetailRow } from "@/src/components/data-explorer/detail-row";
import { useDeployments } from "@/src/modules/deployments/use-deployments";

type DeploymentItem = {
  id: string;
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
  request_id?: string | null;
  actor_email?: string | null;
  created_at: string;
};

type SortMode = "newest" | "oldest" | "action";

export default function DeploymentsPage() {
  const [action, setAction] = useState("");
  const [actorEmail, setActorEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<DeploymentItem | null>(null);

  const query = useDeployments({
    action: action || undefined,
    actor_email: actorEmail || undefined,
    request_id: requestId || undefined,
    limit: 50,
    offset: 0,
  });

 const sortedItems = useMemo(() => {
  const items = (query.data?.items ?? []) as DeploymentItem[];
  const copy = [...items];

  if (sortMode === "oldest") {
    copy.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return copy;
  }

  if (sortMode === "action") {
    copy.sort((a, b) => a.action.localeCompare(b.action));
    return copy;
  }

  copy.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return copy;
}, [query.data?.items, sortMode]);

  const pagedItems = sortedItems.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Deployments"
          subtitle="Review publishes, activations, and rollbacks across snapshot history with actor and request correlation."
        />

        <SectionCard title="Deployment History">
          <TableToolbar
            left={
              <>
                <FilterSelect
                  value={action}
                  onChange={(e) => {
                    setAction(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All actions</option>
                  <option value="PUBLISH">PUBLISH</option>
                  <option value="ACTIVATE">ACTIVATE</option>
                  <option value="ROLLBACK">ROLLBACK</option>
                </FilterSelect>

                <FilterInput
                  placeholder="Actor email"
                  value={actorEmail}
                  onChange={(e) => {
                    setActorEmail(e.target.value);
                    setPage(0);
                  }}
                />

                <FilterInput
                  placeholder="Request ID"
                  value={requestId}
                  onChange={(e) => {
                    setRequestId(e.target.value);
                    setPage(0);
                  }}
                />
              </>
            }
            right={
              <FilterSelect
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="action">Action A-Z</option>
              </FilterSelect>
            }
          />

          <FiltersBar>
            <div style={{ fontSize: 13, color: "#6B665F" }}>
              Click a deployment row to inspect actor attribution and request correlation.
            </div>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading deployment history...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load deployment history.</div>
          ) : sortedItems.length === 0 ? (
            <EmptyState
              title="No deployment events found"
              description="Publish or activate a snapshot to populate deployment history."
            />
          ) : (
            <>
              <DataTable columns={["Action", "Snapshot", "Actor", "Request ID", "Created At"]}>
                {pagedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <DataTableRow
                      key={item.id ?? `${item.snapshot_version}-${item.created_at}`}
                      columns={[
                        <StatusBadge
                          key={`action-${item.id ?? `${item.snapshot_version}-${item.created_at}`}`}
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
                        item.actor_email ?? "—",
                        item.request_id ?? "—",
                        new Date(item.created_at).toLocaleString(),
                      ]}
                    />
                  </div>
                ))}
              </DataTable>

              <PaginationControls
                page={page}
                pageSize={pageSize}
                itemCount={sortedItems.length}
                onPrevious={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() =>
                  setPage((p) =>
                    (p + 1) * pageSize < sortedItems.length ? p + 1 : p,
                  )
                }
              />
            </>
          )}
        </SectionCard>

        {selectedItem ? (
          <DetailPanel title="Deployment Detail">
            <DetailRow label="Deployment ID" value={selectedItem.id} />
            <DetailRow label="Action" value={selectedItem.action} />
            <DetailRow label="Snapshot" value={`v${selectedItem.snapshot_version}`} />
            <DetailRow label="Actor Email" value={selectedItem.actor_email ?? "—"} />
            <DetailRow label="Request ID" value={selectedItem.request_id ?? "—"} />
            <DetailRow
              label="Created At"
              value={new Date(selectedItem.created_at).toLocaleString()}
            />
          </DetailPanel>
        ) : null}
      </PageStack>
    </SystemPage>
  );
}