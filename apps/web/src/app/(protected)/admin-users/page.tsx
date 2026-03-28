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
import {
  AdminUserItem,
  useAdminUsers,
  useCreateAdminUser,
} from "@/src/modules/admin-users/use-admin-users";

type SortMode = "email" | "role" | "created";

export default function AdminUsersPage() {
  const query = useAdminUsers();
  const createMutation = useCreateAdminUser();
  const canManage = useCapability("adminUsers.manage");

  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminUserItem | null>(null);

  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("created");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"viewer" | "security" | "admin">("viewer");

 const filteredItems = useMemo(() => {
  const items = (query.data ?? []) as AdminUserItem[];
  let result = [...items];

  if (emailFilter.trim()) {
    const needle = emailFilter.trim().toLowerCase();
    result = result.filter((item) => item.email.toLowerCase().includes(needle));
  }

  if (roleFilter) {
    result = result.filter((item) => item.role === roleFilter);
  }

  if (sortMode === "email") {
    result.sort((a, b) => a.email.localeCompare(b.email));
  } else if (sortMode === "role") {
    result.sort((a, b) => a.role.localeCompare(b.role));
  } else {
    result.sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );
  }

  return result;
}, [query.data, emailFilter, roleFilter, sortMode]);


  const pagedItems = filteredItems.slice(page * pageSize, (page + 1) * pageSize);

  async function handleCreateAdminUser() {
    setMessage("");

    if (!formEmail.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!formEmail.includes("@")) {
      setMessage("Email must be valid.");
      return;
    }

    if (formPassword.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        email: formEmail.trim(),
        password: formPassword,
        role: formRole,
      });

      setMessage("Admin user created successfully.");
      setFormEmail("");
      setFormPassword("");
      setFormRole("viewer");
    } catch {
      setMessage("Failed to create admin user.");
    }
  }

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Admin Users"
          subtitle="Manage internal Control Plane users and assign the appropriate admin role for each operator."
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

        {!canManage ? (
          <CapabilityHint>
            Your role cannot manage admin users. This page is reserved for admin-only user
            management.
          </CapabilityHint>
        ) : null}

        <SectionCard title="Admin Users Explorer">
          <TableToolbar
            left={
              <>
                <FilterInput
                  placeholder="Filter by email"
                  value={emailFilter}
                  onChange={(e) => {
                    setEmailFilter(e.target.value);
                    setPage(0);
                  }}
                />

                <FilterSelect
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All roles</option>
                  <option value="viewer">viewer</option>
                  <option value="security">security</option>
                  <option value="admin">admin</option>
                </FilterSelect>
              </>
            }
            right={
              <FilterSelect
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="created">Newest first</option>
                <option value="email">Sort by email</option>
                <option value="role">Sort by role</option>
              </FilterSelect>
            }
          />

          <FiltersBar>
            <div style={{ fontSize: 13, color: "#6B665F" }}>
              Click a user row to inspect details and verify assigned role.
            </div>
          </FiltersBar>

          {query.isLoading ? (
            <div style={{ color: "#6B665F" }}>Loading admin users...</div>
          ) : query.isError ? (
            <div style={{ color: "#B54848" }}>Failed to load admin users.</div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No admin users found"
              description="Create a viewer, security, or admin account to test role-aware access."
            />
          ) : (
            <>
              <DataTable columns={["Email", "Role", "Created At"]}>
                {pagedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <DataTableRow
                      columns={[
                        item.email,
                        item.role === "admin" ? (
                          <StatusBadge tone="gold">admin</StatusBadge>
                        ) : item.role === "security" ? (
                          <StatusBadge tone="violet">security</StatusBadge>
                        ) : (
                          <StatusBadge>viewer</StatusBadge>
                        ),
                        item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "—",
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
          <DetailPanel title="Admin User Detail">
            <DetailRow label="User ID" value={selectedItem.id} />
            <DetailRow label="Email" value={selectedItem.email} />
            <DetailRow
              label="Role"
              value={
                selectedItem.role === "admin" ? (
                  <StatusBadge tone="gold">admin</StatusBadge>
                ) : selectedItem.role === "security" ? (
                  <StatusBadge tone="violet">security</StatusBadge>
                ) : (
                  <StatusBadge>viewer</StatusBadge>
                )
              }
            />
            <DetailRow
              label="Created At"
              value={
                selectedItem.created_at
                  ? new Date(selectedItem.created_at).toLocaleString()
                  : "—"
              }
            />
          </DetailPanel>
        ) : null}

        {canManage ? (
          <SectionCard title="Create Admin User">
            <div style={{ display: "grid", gap: 12 }}>
              <input
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Email"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <input
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                type="password"
                placeholder="Password"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              />

              <select
                value={formRole}
                onChange={(e) =>
                  setFormRole(e.target.value as "viewer" | "security" | "admin")
                }
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E7E5E4",
                  background: "#FFFFFF",
                }}
              >
                <option value="viewer">viewer</option>
                <option value="security">security</option>
                <option value="admin">admin</option>
              </select>

              <div>
                <ActionButton
                  tone="violet"
                  onClick={handleCreateAdminUser}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Admin User"}
                </ActionButton>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </PageStack>
    </SystemPage>
  );
}