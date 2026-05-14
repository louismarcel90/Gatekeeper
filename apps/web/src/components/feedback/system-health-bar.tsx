"use client";

import { useControlPlaneHealth } from "@/src/modules/health/use-control-plane-health";
import { StatusBadge } from "@/src/components/data-display/status-badge";

export function SystemHealthBar() {
  const healthQuery = useControlPlaneHealth();

  const isHealthy = healthQuery.data?.ok === true && !healthQuery.isError;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#111111" }}>System Health</div>
        <div style={{ fontSize: 13, color: "#6B665F" }}>
          Control Plane health and frontend sync status.
        </div>
      </div>

      <div>
        {healthQuery.isLoading ? (
          <StatusBadge>Checking</StatusBadge>
        ) : isHealthy ? (
          <StatusBadge tone="green">Healthy</StatusBadge>
        ) : (
          <StatusBadge tone="red">Degraded</StatusBadge>
        )}
      </div>
    </div>
  );
}
