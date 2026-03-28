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
import { InlineMessage } from "@/src/components/feedback/inline-message";
import { CapabilityHint } from "@/src/components/feedback/capability-hint";
import { ActionButton } from "@/src/components/controls/action-button";
import { DetailPanel } from "@/src/components/data-explorer/detail-panel";
import { DetailRow } from "@/src/components/data-explorer/detail-row";
import { PaginationControls } from "@/src/components/data-explorer/pagination-controls";
import { TableToolbar } from "@/src/components/data-explorer/table-toolbar";
import { SystemPage } from "@/src/components/page-layout/system-page";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { useCapability } from "@/src/modules/permissions/use-capability";
import { RouteInput, useCreateRoute, useRoutes } from "@/src/modules/routes/use-routes";

type RouteItem = {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  upstream_url: string;
  enabled: boolean;
};

type SortMode = "path" | "method" | "enabled";

const EMPTY_FORM: RouteInput = {
  id: "",
  path: "",
  method: "GET",
  upstream_url: "",
  enabled: true,
};

export default function RoutesPage() {
  const query = useRoutes();
  const createMutation = useCreateRoute();
  const canCreate = useCapability("snapshots.publish");

  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<RouteItem | null>(null);

  const [pathFilter, setPathFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("path");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [form, setForm] = useState<RouteInput>(EMPTY_FORM);

  const filteredItems = useMemo(() => {
  const items = (query.data ?? []) as RouteItem[];
  let result = [...items];

  if (pathFilter.trim()) {
    const needle = pathFilter.trim().toLowerCase();
    result = result.filter((item) => item.path.toLowerCase().includes(needle));
  }

  if (methodFilter) {
    result = result.filter((item) => item.method === methodFilter);
  }

  if (sortMode === "method") {
    result.sort((a, b) => a.method.localeCompare(b.method));
  } else if (sortMode === "enabled") {
    result.sort((a, b) => Number(b.enabled) - Number(a.enabled));
  } else {
    result.sort((a, b) => a.path.localeCompare(b.path));
  }

  return result;
}, [query.data, pathFilter, methodFilter, sortMode]);

  const pagedItems = filteredItems.slice(page * pageSize, (page + 1) * pageSize);

  function updateForm<K extends keyof RouteInput>(key: K, value: RouteInput[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleCreateRoute() {
    setMessage("");

    if (!form.id.trim()) {
      setMessage("Route ID is required.");
      return;
    }

    if (!form.path.trim().startsWith("/")) {
      setMessage("Route path must start with '/'.");
      return;
    }

    try {
      new URL(form.upstream_url);
    } catch {
      setMessage("Upstream URL must be a valid absolute URL.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...form,
        id: form.id.trim(),
        path: form.path.trim(),
        upstream_url: form.upstream_url.trim(),
      });

      setMessage("Route created successfully.");
      setForm(EMPTY_FORM);
    } catch {
      setMessage("Failed to create route.");
    }
  }

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Routes"
          subtitle="Inspect managed routes and register new API entry points for policy enforcement."
        />

        {message ? (
          <InlineMessage
            tone={message.toLowerCase().includes("failed") || message.includes("required") || message.includes("must")
              ? "error"
              : "success"}
          >
            {message}
          </InlineMessage>
        ) : null}

        {!canCreate ? (
          <CapabilityHint>
            Your role can inspect routes, but creating a new route requires a security or
            admin role.
          </CapabilityHint>
        ) : null}

        <SectionCard title="Routes Explorer">
          <TableToolbar
            left={
              <>
                <FilterInput
                  placeholder="Filter by path"
                  value={pathFilter}
                  onChange={(e) => {
                    setPathFilter(e.target.value);
                    setPage(0);
                  }}
                />

                <FilterSelect
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </FilterSelect>
              </>
            }
            right={
              <FilterSelect
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="path">Sort by path</option>
                <option value="method">Sort by method</option>
                <option value="enabled">Sort by enabled</option>
              </FilterSelect>
            }
          />

          <FiltersBar>
            <div style={{ fontSize: 13, color: "#6B665F" }}>
              Click a route row to inspect its details.
            </div>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading routes...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load routes.</div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No routes found"
              description="Adjust filters or create a new route to start governance on traffic paths."
            />
          ) : (
            <>
              <DataTable columns={["Path", "Method", "Upstream", "Status"]}>
                {pagedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <DataTableRow
                      columns={[
                        item.path,
                        item.method,
                        item.upstream_url,
                        item.enabled ? (
                          <StatusBadge tone="green">Enabled</StatusBadge>
                        ) : (
                          <StatusBadge tone="red">Disabled</StatusBadge>
                        ),
                      ]}
                    />
                  </div>
                ))}
              </DataTable>

              <PaginationControls
                page={page}
                pageSize={pageSize}
                itemCount={filteredItems.length}
                onPrevious={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() =>
                  setPage((p) =>
                    (p + 1) * pageSize < filteredItems.length ? p + 1 : p,
                  )
                }
              />
            </>
          )}
        </SectionCard>

        {selectedItem ? (
          <DetailPanel title="Route Detail">
            <DetailRow label="Route ID" value={selectedItem.id} />
            <DetailRow label="Path" value={selectedItem.path} />
            <DetailRow label="Method" value={selectedItem.method} />
            <DetailRow label="Upstream URL" value={selectedItem.upstream_url} />
            <DetailRow
              label="Enabled"
              value={
                selectedItem.enabled ? (
                  <StatusBadge tone="green">Enabled</StatusBadge>
                ) : (
                  <StatusBadge tone="red">Disabled</StatusBadge>
                )
              }
            />
          </DetailPanel>
        ) : null}

        {canCreate ? (
          <SectionCard title="Create Route">
            <div style={{ display: "grid", gap: 12 }}>
              <input
                value={form.id}
                onChange={(e) => updateForm("id", e.target.value)}
                placeholder="Route ID (e.g. route_search_get)"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={form.path}
                onChange={(e) => updateForm("path", e.target.value)}
                placeholder="Path (e.g. /search)"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <select
                value={form.method}
                onChange={(e) =>
                  updateForm(
                    "method",
                    e.target.value as RouteInput["method"],
                  )
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
                value={form.upstream_url}
                onChange={(e) => updateForm("upstream_url", e.target.value)}
                placeholder="Upstream URL"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "#111111",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => updateForm("enabled", e.target.checked)}
                />
                Enabled
              </label>

              <div>
                <ActionButton
                  tone="violet"
                  onClick={handleCreateRoute}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Route"}
                </ActionButton>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </PageStack>
    </SystemPage>
  );
}