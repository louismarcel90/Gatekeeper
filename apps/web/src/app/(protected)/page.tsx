"use client";

import { PageHeader } from "@/src/components/app-shell/page-header";
import { StatCard } from "@/src/components/app-shell/stat-card";
import { SectionCard } from "@/src/components/data-display/section-card";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { PageSectionGrid } from "@/src/components/page-layout/page-section-grid";
import { PageStack } from "@/src/components/page-layout/page-stack";
import { PageTwoPane } from "@/src/components/page-layout/page-two-pane";
import { SystemPage } from "@/src/components/page-layout/system-page";
import { RecentUiEvents } from "@/src/components/feedback/recent-ui-events";
import { useAuthStore } from "@/src/core/state/auth-store";
import { useRoutes } from "@/src/modules/routes/use-routes";
import { useActiveSnapshot } from "@/src/modules/snapshots/use-snapshots";
import { RecentDomainEvents } from "@/src/components/realtime/recent-domain-events";

type RouteItem = {
  id: string;
  method: string;
  path: string;
  enabled: boolean;
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const routesQuery = useRoutes();
  const activeSnapshotQuery = useActiveSnapshot();

  const routes = (routesQuery.data ?? []) as RouteItem[];
  const enabledRoutes = routes.filter((route) => route.enabled).length;

  return (
    <SystemPage>
      <PageStack>
        <PageHeader
          title="Dashboard"
          subtitle="Operate, investigate, and govern API access decisions across Gatekeeper with a calm, auditable, and deployment-safe control plane."
          action={<StatusBadge tone="gold">{user?.role ?? "unknown"}</StatusBadge>}
        />
        
        <RecentDomainEvents />

        <PageSectionGrid>
          <StatCard label="Managed Routes" value={routes.length} />
          <StatCard label="Enabled Routes" value={enabledRoutes} accent="violet" />
          <StatCard
            label="Active Snapshot"
            value={activeSnapshotQuery.data?.version ?? "-"}
            accent="gold"
          />
        </PageSectionGrid>

        <PageTwoPane
          left={
            <SectionCard title="Routes Overview">
              {routesQuery.isLoading ? (
                <div style={{ color: "#6B665F", fontSize: 14 }}>Loading routes...</div>
              ) : routesQuery.isError ? (
                <div style={{ color: "#B54848", fontSize: 14 }}>
                  Failed to load routes. Dashboard remains usable in degraded mode.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
                  {routes.slice(0, 5).map((route) => (
                    <div
                      key={route.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "64px minmax(0, 1fr) 96px",
                        gap: 10,
                        alignItems: "center",
                        padding: "12px 14px",
                        borderRadius: 14,
                        background: "#FCFCFB",
                        border: "1px solid #EEEAE6",
                        color: "#111111",
                        minWidth: 0,
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{route.method}</strong>

                      <span
                        style={{
                          color: "#57534E",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 14,
                        }}
                      >
                        {route.path}
                      </span>

                      <div style={{ justifySelf: "end" }}>
                        <StatusBadge tone={route.enabled ? "green" : "red"}>
                          {route.enabled ? "Enabled" : "Disabled"}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          }
          right={<RecentUiEvents />}
        />
      </PageStack>
    </SystemPage>
  );
}
