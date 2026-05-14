"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { PageHeader } from "@/src/components/app-shell/page-header";
import { DataTable, DataTableRow } from "@/src/components/data-display/data-table";
import { FilterInput, FilterSelect, FiltersBar } from "@/src/components/data-display/filters-bar";
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
import {
  PolicyInput,
  useCreatePolicy,
  usePolicies,
  useUpdatePolicy,
} from "@/src/modules/policies/use-policies";
import {
  includesNormalized,
  paginateItems,
  stableSortByNumber,
  stableSortByString,
} from "../../../core/performance/array-utils";
import { PerformanceNote } from "@/src/components/performance/performance-note";

type PolicyItem = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

type SortMode = "id" | "route" | "rate";

type PolicyFormState = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string;
  rate_limit_per_minute: string;
  quota_per_day: string;
};

const EMPTY_CREATE_FORM: PolicyFormState = {
  id: "",
  route_id: "",
  require_api_key: true,
  required_scopes: "",
  rate_limit_per_minute: "60",
  quota_per_day: "1000",
};

const EMPTY_EDIT_FORM: PolicyFormState = {
  id: "",
  route_id: "",
  require_api_key: true,
  required_scopes: "",
  rate_limit_per_minute: "",
  quota_per_day: "",
};

const inputStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #E7E5E4",
  background: "#FFFFFF",
};

function parseNullablePositiveNumber(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parseScopes(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderComparisonValue(value: string | number | boolean | null): string {
  if (value === null) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

function getChangedTextStyle(changed: boolean): CSSProperties {
  return {
    fontWeight: changed ? 700 : 400,
    color: changed ? "#9A6A2C" : "#111111",
  };
}

export default function PoliciesPage() {
  const query = usePolicies();
  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();
  const canCreate = useCapability("snapshots.publish");

  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<PolicyItem | null>(null);
  const [routeFilter, setRouteFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("id");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState<PolicyFormState>(EMPTY_CREATE_FORM);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [originalPolicy, setOriginalPolicy] = useState<PolicyItem | null>(null);
  const [editForm, setEditForm] = useState<PolicyFormState>(EMPTY_EDIT_FORM);

  const pageSize = 10;
  const items = useMemo(() => (query.data ?? []) as PolicyItem[], [query.data]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (routeFilter.trim()) {
      result = result.filter((item) => includesNormalized(item.route_id, routeFilter));
    }

    if (sortMode === "route") {
      return stableSortByString(result, (item) => item.route_id);
    }

    if (sortMode === "rate") {
      return stableSortByNumber(result, (item) => item.rate_limit_per_minute ?? 0);
    }

    return stableSortByString(result, (item) => item.id);
  }, [items, routeFilter, sortMode]);

  const pagedItems = useMemo(
    () =>
      paginateItems({
        items: filteredItems,
        page,
        pageSize,
      }),
    [filteredItems, page],
  );

  function buildPolicyPayload(source: PolicyFormState): PolicyInput | null {
    if (!source.id.trim()) {
      setMessage("Policy ID is required.");
      return null;
    }

    if (!source.route_id.trim()) {
      setMessage("Route ID is required.");
      return null;
    }

    const rateLimit = parseNullablePositiveNumber(source.rate_limit_per_minute);
    const quota = parseNullablePositiveNumber(source.quota_per_day);

    if (source.rate_limit_per_minute.trim() !== "" && rateLimit === null) {
      setMessage("Rate limit must be a positive number or empty.");
      return null;
    }

    if (source.quota_per_day.trim() !== "" && quota === null) {
      setMessage("Quota must be a positive number or empty.");
      return null;
    }

    return {
      id: source.id.trim(),
      route_id: source.route_id.trim(),
      require_api_key: source.require_api_key,
      required_scopes: parseScopes(source.required_scopes),
      rate_limit_per_minute: rateLimit,
      quota_per_day: quota,
    };
  }

  function startEditingPolicy(policy: PolicyItem) {
    setEditingPolicyId(policy.id);
    setOriginalPolicy(policy);
    setEditForm({
      id: policy.id,
      route_id: policy.route_id,
      require_api_key: policy.require_api_key,
      required_scopes: policy.required_scopes.join(", "),
      rate_limit_per_minute:
        policy.rate_limit_per_minute === null ? "" : String(policy.rate_limit_per_minute),
      quota_per_day: policy.quota_per_day === null ? "" : String(policy.quota_per_day),
    });
  }

  async function handleCreatePolicy() {
    setMessage("");

    const payload = buildPolicyPayload(form);

    if (!payload) {
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      setMessage("Policy created successfully.");
      setForm(EMPTY_CREATE_FORM);
    } catch {
      setMessage("Failed to create policy.");
    }
  }

  async function handleUpdatePolicy() {
    setMessage("");

    const payload = buildPolicyPayload(editForm);

    if (!payload) {
      return;
    }

    try {
      await updateMutation.mutateAsync(payload);
      setMessage("Policy updated successfully.");
      setEditingPolicyId(null);
      setOriginalPolicy(null);
      setEditForm(EMPTY_EDIT_FORM);
    } catch {
      setMessage("Failed to update policy.");
    }
  }

  const editRateLimit = parseNullablePositiveNumber(editForm.rate_limit_per_minute);
  const editQuota = parseNullablePositiveNumber(editForm.quota_per_day);

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Policies"
          subtitle="Inspect enforcement policies and attach new access, rate limit, and quota rules to managed routes."
        />

        {message ? (
          <InlineMessage
            tone={
              message.toLowerCase().includes("failed") ||
              message.includes("required") ||
              message.includes("must")
                ? "error"
                : "success"
            }
          >
            {message}
          </InlineMessage>
        ) : null}

        {!canCreate ? (
          <CapabilityHint>
            Your role can inspect policies, but creating or editing a policy requires a security or
            admin role.
          </CapabilityHint>
        ) : null}

        <SectionCard title="Policies Explorer">
          <TableToolbar
            left={
              <FilterInput
                placeholder="Filter by route ID"
                value={routeFilter}
                onChange={(event) => {
                  setRouteFilter(event.target.value);
                  setPage(0);
                }}
              />
            }
            right={
              <FilterSelect
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
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

          <PerformanceNote>
            Policies are filtered, sorted, and paginated through memoized selectors to keep
            rendering predictable as policy count grows.
          </PerformanceNote>

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
              <DataTable columns={["Policy ID", "Route ID", "Scopes", "Rate", "Quota", "Actions"]}>
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
                        item.required_scopes.length > 0 ? item.required_scopes.join(", ") : "—",
                        item.rate_limit_per_minute ?? "—",
                        item.quota_per_day ?? "—",
                        <div
                          key={`${item.id}-actions`}
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {canCreate ? (
                            <ActionButton tone="neutral" onClick={() => startEditingPolicy(item)}>
                              Edit
                            </ActionButton>
                          ) : (
                            "—"
                          )}
                        </div>,
                      ]}
                    />
                  </div>
                ))}
              </DataTable>

              <PaginationControls
                page={page}
                pageSize={pageSize}
                itemCount={filteredItems.length}
                onPrevious={() => setPage((current) => Math.max(0, current - 1))}
                onNext={() =>
                  setPage((current) =>
                    (current + 1) * pageSize < filteredItems.length ? current + 1 : current,
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
            <DetailRow label="Rate Limit / Min" value={selectedItem.rate_limit_per_minute ?? "—"} />
            <DetailRow label="Quota / Day" value={selectedItem.quota_per_day ?? "—"} />
          </DetailPanel>
        ) : null}

        {editingPolicyId ? (
          <SectionCard title={`Edit Policy: ${editingPolicyId}`}>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                value={editForm.route_id}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    route_id: event.target.value,
                  }))
                }
                placeholder="Route ID"
                style={inputStyle}
              />

              <input
                value={editForm.required_scopes}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    required_scopes: event.target.value,
                  }))
                }
                placeholder="Required scopes, comma separated"
                style={inputStyle}
              />

              <input
                value={editForm.rate_limit_per_minute}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    rate_limit_per_minute: event.target.value,
                  }))
                }
                placeholder="Rate limit per minute"
                style={inputStyle}
              />

              <input
                value={editForm.quota_per_day}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    quota_per_day: event.target.value,
                  }))
                }
                placeholder="Quota per day"
                style={inputStyle}
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
                  checked={editForm.require_api_key}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      require_api_key: event.target.checked,
                    }))
                  }
                />
                Require API key
              </label>

              {originalPolicy ? (
                <SectionCard title="Before / After Preview">
                  <DataTable columns={["Field", "Before", "After"]}>
                    <DataTableRow
                      columns={[
                        "route_id",
                        originalPolicy.route_id,
                        <span
                          key="route_id-after"
                          style={getChangedTextStyle(originalPolicy.route_id !== editForm.route_id)}
                        >
                          {editForm.route_id || "—"}
                        </span>,
                      ]}
                    />
                    <DataTableRow
                      columns={[
                        "required_scopes",
                        originalPolicy.required_scopes.join(", ") || "—",
                        <span
                          key="required_scopes-after"
                          style={getChangedTextStyle(
                            originalPolicy.required_scopes.join(", ") !== editForm.required_scopes,
                          )}
                        >
                          {editForm.required_scopes || "—"}
                        </span>,
                      ]}
                    />
                    <DataTableRow
                      columns={[
                        "rate_limit_per_minute",
                        renderComparisonValue(originalPolicy.rate_limit_per_minute),
                        <span
                          key="rate_limit-after"
                          style={getChangedTextStyle(
                            originalPolicy.rate_limit_per_minute !== editRateLimit,
                          )}
                        >
                          {renderComparisonValue(editRateLimit)}
                        </span>,
                      ]}
                    />
                    <DataTableRow
                      columns={[
                        "quota_per_day",
                        renderComparisonValue(originalPolicy.quota_per_day),
                        <span
                          key="quota-after"
                          style={getChangedTextStyle(originalPolicy.quota_per_day !== editQuota)}
                        >
                          {renderComparisonValue(editQuota)}
                        </span>,
                      ]}
                    />
                    <DataTableRow
                      columns={[
                        "require_api_key",
                        renderComparisonValue(originalPolicy.require_api_key),
                        <span
                          key="require_api_key-after"
                          style={getChangedTextStyle(
                            originalPolicy.require_api_key !== editForm.require_api_key,
                          )}
                        >
                          {renderComparisonValue(editForm.require_api_key)}
                        </span>,
                      ]}
                    />
                  </DataTable>
                </SectionCard>
              ) : null}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <ActionButton
                  tone="violet"
                  onClick={handleUpdatePolicy}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </ActionButton>

                <ActionButton
                  tone="neutral"
                  onClick={() => {
                    setEditingPolicyId(null);
                    setOriginalPolicy(null);
                    setEditForm(EMPTY_EDIT_FORM);
                  }}
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          </SectionCard>
        ) : null}

        {canCreate ? (
          <SectionCard title="Create Policy">
            <div style={{ display: "grid", gap: 12 }}>
              <input
                value={form.id}
                onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
                placeholder="Policy ID"
                style={inputStyle}
              />

              <input
                value={form.route_id}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    route_id: event.target.value,
                  }))
                }
                placeholder="Route ID"
                style={inputStyle}
              />

              <input
                value={form.required_scopes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    required_scopes: event.target.value,
                  }))
                }
                placeholder="Required scopes (comma separated)"
                style={inputStyle}
              />

              <input
                value={form.rate_limit_per_minute}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rate_limit_per_minute: event.target.value,
                  }))
                }
                placeholder="Rate limit per minute"
                style={inputStyle}
              />

              <input
                value={form.quota_per_day}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quota_per_day: event.target.value,
                  }))
                }
                placeholder="Quota per day"
                style={inputStyle}
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
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      require_api_key: event.target.checked,
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
