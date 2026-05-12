"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from '../../../components/data-display/data-table';
import {
  FilterInput,
  FiltersBar,
} from '../../../components/data-display/filters-bar';
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { EmptyState } from "@/src/components/feedback/empty-sate";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { SystemPage } from "@/src/components/page-layout/system-page";
import { useAdminAuditEvents } from "@/src/modules/admin-audit/use-admin-audit-events";

type AdminAuditEventItem = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  actor_email: string | null;
  request_id: string | null;
  created_at: string;
};

function getTone(action: string): "green" | "gold" | "red" | "violet" {
  if (action.includes("rollback") || action.includes("lifecycle")) {
    return "gold";
  }

  if (action.includes("created") || action.includes("published")) {
    return "green";
  }

  if (action.includes("updated") || action.includes("activated")) {
    return "violet";
  }

  return "violet";
}

export default function AdminAuditPage() {
  const query = useAdminAuditEvents();
  const [filter, setFilter] = useState("");

 const filteredItems = useMemo(() => {
  const items = (query.data ?? []) as AdminAuditEventItem[];

  if (!filter.trim()) {
    return items;
  }

  const needle = filter.trim().toLowerCase();

  return items.filter((item: AdminAuditEventItem) =>
    item.action.toLowerCase().includes(needle) ||
    item.resource_id.toLowerCase().includes(needle) ||
    item.resource_type.toLowerCase().includes(needle) ||
    (item.actor_email ?? "").toLowerCase().includes(needle) ||
    (item.request_id ?? "").toLowerCase().includes(needle),
  );
}, [query.data, filter]);

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Admin Audit"
          subtitle="Inspect critical control-plane actions with actor attribution, request correlation, and resource traceability."
        />

        <SectionCard title="Admin Audit Events">
          <FiltersBar>
            <FilterInput
              placeholder="Filter by action, resource, actor, or request id"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading audit events...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load audit events.</div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No audit events found"
              description="Critical actions will appear here after routes, policies, or snapshots are changed."
            />
          ) : (
            <DataTable
              columns={[
                "Action",
                "Resource",
                "Actor",
                "Request ID",
                "Created At",
              ]}
            >
              {filteredItems.map((item: AdminAuditEventItem) => (
                <DataTableRow
                  key={item.id}
                  columns={[
                    <StatusBadge key={`${item.id}-action`} tone={getTone(item.action)}>
                      {item.action}
                    </StatusBadge>,
                    `${item.resource_type}:${item.resource_id}`,
                    item.actor_email ?? "system",
                    item.request_id ?? "—",
                    new Date(item.created_at).toLocaleString(),
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