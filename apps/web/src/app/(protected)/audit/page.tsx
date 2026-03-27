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
import { useAuditLogs } from "@/src/modules/audit/use-audit-logs";

type AuditItem = {
  id: string;
  decision_id: string;
  decision: "ALLOW" | "DENY" | "THROTTLE";
  reason_code: string;
  client_id: string | null;
  path: string;
  snapshot_version: number | null;
  request_id?: string | null;
  actor_email?: string | null;
  created_at: string;
  explanation?: string;
  route_id?: string | null;
  policy_id?: string | null;
};

type SortMode = "newest" | "oldest" | "decision";

export default function AuditPage() {
  const [decision, setDecision] = useState("");
  const [clientId, setClientId] = useState("");
  const [actorEmail, setActorEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  const query = useAuditLogs({
    decision: decision || undefined,
    client_id: clientId || undefined,
    actor_email: actorEmail || undefined,
    request_id: requestId || undefined,
    limit: 50,
    offset: 0,
  });

  const sortedItems = useMemo(() => {
  const items = (query.data?.items ?? []) as AuditItem[];
  const copy = [...items];

  if (sortMode === "oldest") {
    copy.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return copy;
  }

  if (sortMode === "decision") {
    copy.sort((a, b) => a.decision.localeCompare(b.decision));
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
          title="Audit Log"
          subtitle="Investigate allow, deny, and throttle decisions across clients, actors, and correlated requests."
        />

        <SectionCard title="Decision Explorer">
          <TableToolbar
            left={
              <>
                <FilterSelect
                  value={decision}
                  onChange={(e) => {
                    setDecision(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All decisions</option>
                  <option value="ALLOW">ALLOW</option>
                  <option value="DENY">DENY</option>
                  <option value="THROTTLE">THROTTLE</option>
                </FilterSelect>

                <FilterInput
                  placeholder="Client ID"
                  value={clientId}
                  onChange={(e) => {
                    setClientId(e.target.value);
                    setPage(0);
                  }}
                />

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
                <option value="decision">Decision A-Z</option>
              </FilterSelect>
            }
          />

          <FiltersBar>
            <div style={{ fontSize: 13, color: "#6B665F" }}>
              Filters apply to the current audit result set. Click any row to inspect full
              request correlation details.
            </div>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading audit logs...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>
              Audit data is temporarily unavailable. Existing page structure remains usable.
            </div>
          ) : sortedItems.length === 0 ? (
            <EmptyState
              title="No audit entries found"
              description="Try adjusting your filters or generate traffic through the gateway."
            />
          ) : (
            <>
              <DataTable
                columns={[
                  "Decision",
                  "Reason Code",
                  "Client ID",
                  "Actor",
                  "Request ID",
                  "Created At",
                ]}
              >
                {pagedItems.map((item) => (
                  <div
                    key={item.decision_id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <DataTableRow
                      key={item.request_id ?? item.created_at}
                      columns={[
                        <StatusBadge
                          key={`decision-${item.request_id ?? item.created_at}`}
                          tone={
                            item.decision === "ALLOW"
                              ? "green"
                              : item.decision === "THROTTLE"
                                ? "gold"
                                : "red"
                          }
                        >
                          {item.decision}
                        </StatusBadge>,
                        item.reason_code,
                        item.client_id ?? "—",
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
          <DetailPanel title="Audit Event Detail">
            <DetailRow label="Decision ID" value={selectedItem.decision_id} />
            <DetailRow label="Decision" value={selectedItem.decision} />
            <DetailRow label="Reason Code" value={selectedItem.reason_code} />
            <DetailRow label="Client ID" value={selectedItem.client_id ?? "—"} />
            <DetailRow label="Path" value={selectedItem.path} />
            <DetailRow label="Snapshot" value={selectedItem.snapshot_version ?? "—"} />
            <DetailRow label="Request ID" value={selectedItem.request_id ?? "—"} />
            <DetailRow label="Actor Email" value={selectedItem.actor_email ?? "—"} />
            <DetailRow label="Route ID" value={selectedItem.route_id ?? "—"} />
            <DetailRow label="Policy ID" value={selectedItem.policy_id ?? "—"} />
            <DetailRow label="Explanation" value={selectedItem.explanation ?? "—"} />
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