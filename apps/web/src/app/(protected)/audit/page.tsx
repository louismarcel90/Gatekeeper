"use client";

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
import { PageContainer } from "@/src/components/page-layout/page-container";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { useAuditLogs } from "@/src/modules/audit/use-audit-logs";
import { useState } from "react";

type AuditItem = {
  decision_id: string;
  decision: "ALLOW" | "DENY" | "THROTTLE";
  reason_code: string;
  client_id: string | null;
  path: string;
  snapshot_version: number | null;
};

export default function AuditPage() {
  const [decision, setDecision] = useState("");
  const [clientId, setClientId] = useState("");

  const query = useAuditLogs({
    decision: decision || undefined,
    client_id: clientId || undefined,
  });

  const items = (query.data ?? []) as AuditItem[];

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          title="Audit Log"
          subtitle="Investigate allow, deny, and throttle decisions across clients, routes, and snapshot versions."
        />

        <SectionCard title="Decision Explorer">
          <FiltersBar>
            <FilterSelect value={decision} onChange={(e) => setDecision(e.target.value)}>
              <option value="">All decisions</option>
              <option value="ALLOW">ALLOW</option>
              <option value="DENY">DENY</option>
              <option value="THROTTLE">THROTTLE</option>
            </FilterSelect>

            <FilterInput
              placeholder="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading audit logs...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load audit logs.</div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No audit entries found"
              description="Try adjusting your filters or generate traffic through the gateway."
            />
          ) : (
            <DataTable
              columns={["Decision", "Reason Code", "Client ID", "Path", "Snapshot"]}
            >
              {items.map((item) => (
                <DataTableRow
                  key={item.decision_id}
                  columns={[
                    <StatusBadge
                      key="status"
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
                    item.path,
                    item.snapshot_version ?? "—",
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