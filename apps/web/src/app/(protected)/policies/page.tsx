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
import { PolicyInput, useCreatePolicy, usePolicies } from "@/src/modules/policies/use-policies";

type PolicyItem = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

type SortMode = "id" | "route" | "rate";

const EMPTY_FORM: PolicyInput = {
  id: "",
  route_id: "",
  require_api_key: true,
  required_scopes: [],
  rate_limit_per_minute: 60,
  quota_per_day: 1000,
};

export default function PoliciesPage() {
  const query = usePolicies();
  const createMutation = useCreatePolicy();
  const canCreate = useCapability("snapshots.publish");

  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<PolicyItem | null>(null);

  const [routeFilter, setRouteFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("id");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [form, setForm] = useState({
    id: EMPTY_FORM.id,
    route_id: EMPTY_FORM.route_id,
    require_api_key: EMPTY_FORM.require_api_key,
    required_scopes: "",
    rate_limit_per_minute: String(EMPTY_FORM.rate_limit_per_minute ?? ""),
    quota_per_day: String(EMPTY_FORM.quota_per_day ?? ""),
  });

  const filteredItems = useMemo(() => {
  const items = (query.data ?? []) as PolicyItem[];
  let result = [...items];

  if (routeFilter.trim()) {
    const needle = routeFilter.trim().toLowerCase();
    result = result.filter((item) => item.route_id.toLowerCase().includes(needle));
  }

  if (sortMode === "route") {
    result.sort((a, b) => a.route_id.localeCompare(b.route_id));
  } else if (sortMode === "rate") {
    result.sort(
      (a, b) => (a.rate_limit_per_minute ?? 0) - (b.rate_limit_per_minute ?? 0),
    );
  } else {
    result.sort((a, b) => a.id.localeCompare(b.id));
  }

  return result;
}, [query.data, routeFilter, sortMode]);
  const pagedItems = filteredItems.slice(page * pageSize, (page + 1) * pageSize);

  async function handleCreatePolicy() {
    setMessage("");

    if (!form.id.trim()) {
      setMessage("Policy ID is required.");
      return;
    }

    if (!form.route_id.trim()) {
      setMessage("Route ID is required.");
      return;
    }

    const scopes = form.required_scopes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const parsedRate =
      form.rate_limit_per_minute.trim() === ""
        ? null
        : Number(form.rate_limit_per_minute);

    const parsedQuota =
      form.quota_per_day.trim() === ""
        ? null
        : Number(form.quota_per_day);

    if (parsedRate !== null && Number.isNaN(parsedRate)) {
      setMessage("Rate limit must be a valid number.");
      return;
    }

    if (parsedQuota !== null && Number.isNaN(parsedQuota)) {
      setMessage("Quota per day must be a valid number.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        id: form.id.trim(),
        route_id: form.route_id.trim(),
        require_api_key: form.require_api_key,
        required_scopes: scopes,
        rate_limit_per_minute: parsedRate,
        quota_per_day: parsedQuota,
      });

      setMessage("Policy created successfully.");
      setForm({
        id: "",
        route_id: "",
        require_api_key: true,
        required_scopes: "",
        rate_limit_per_minute: "60",
        quota_per_day: "1000",
      });
    } catch {
      setMessage("Failed to create policy.");
    }
  }

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Policies"
          subtitle="Inspect enforcement policies and attach new access, rate limit, and quota rules to managed routes."
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
            Your role can inspect policies, but creating a new policy requires a security
            or admin role.
          </CapabilityHint>
        ) : null}

        <SectionCard title="Policies Explorer">
          <TableToolbar
            left={
              <FilterInput
                placeholder="Filter by route ID"
                value={routeFilter}
                onChange={(e) => {
                  setRouteFilter(e.target.value);
                  setPage(0);
                }}
              />
            }
            right={
              <FilterSelect
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="id">Sort by policy ID</option>
                <option value="route">Sort by route ID</option>
                <option value="rate">Sort by rate limit</option>
              </FilterSelect>
            }
          />

          <FiltersBar>
            <div style={{ fontSize: 13, color: "#6B665F" }}>
              Click a policy row to inspect scopes, limits, and quota configuration.
            </div>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading policies...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load policies.</div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No policies found"
              description="Create a policy to start enforcing access and traffic controls on routes."
            />
          ) : (
            <>
              <DataTable columns={["Policy ID", "Route ID", "Scopes", "Rate", "Quota"]}>
                {pagedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <DataTableRow
                      columns={[
                        item.id,
                        item.route_id,
                        item.required_scopes.length > 0
                          ? item.required_scopes.join(", ")
                          : "—",
                        item.rate_limit_per_minute ?? "—",
                        item.quota_per_day ?? "—",
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
          <DetailPanel title="Policy Detail">
            <DetailRow label="Policy ID" value={selectedItem.id} />
            <DetailRow label="Route ID" value={selectedItem.route_id} />
            <DetailRow
              label="API Key Required"
              value={
                selectedItem.require_api_key ? (
                  <StatusBadge tone="gold">Required</StatusBadge>
                ) : (
                  <StatusBadge>Optional</StatusBadge>
                )
              }
            />
            <DetailRow
              label="Scopes"
              value={
                selectedItem.required_scopes.length > 0
                  ? selectedItem.required_scopes.join(", ")
                  : "—"
              }
            />
            <DetailRow
              label="Rate Limit / Min"
              value={selectedItem.rate_limit_per_minute ?? "—"}
            />
            <DetailRow
              label="Quota / Day"
              value={selectedItem.quota_per_day ?? "—"}
            />
          </DetailPanel>
        ) : null}

        {canCreate ? (
          <SectionCard title="Create Policy">
            <div style={{ display: "grid", gap: 12 }}>
              <input
                value={form.id}
                onChange={(e) =>
                  setForm((current) => ({ ...current, id: e.target.value }))
                }
                placeholder="Policy ID"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={form.route_id}
                onChange={(e) =>
                  setForm((current) => ({ ...current, route_id: e.target.value }))
                }
                placeholder="Route ID"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={form.required_scopes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    required_scopes: e.target.value,
                  }))
                }
                placeholder="Required scopes (comma separated)"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={form.rate_limit_per_minute}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    rate_limit_per_minute: e.target.value,
                  }))
                }
                placeholder="Rate limit per minute"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={form.quota_per_day}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    quota_per_day: e.target.value,
                  }))
                }
                placeholder="Quota per day"
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
                  checked={form.require_api_key}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      require_api_key: e.target.checked,
                    }))
                  }
                />
                Require API key
              </label>

              <div>
                <ActionButton
                  tone="violet"
                  onClick={handleCreatePolicy}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Policy"}
                </ActionButton>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </PageStack>
    </SystemPage>
  );
}