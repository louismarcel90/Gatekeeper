"use client";

import { useControlPlaneHealth } from "@/src/modules/health/use-control-plane-health";

export function DegradedModeBanner() {
  const healthQuery = useControlPlaneHealth();

  if (healthQuery.isLoading) {
    return null;
  }

  const isHealthy = healthQuery.data?.ok === true && !healthQuery.isError;

  if (isHealthy) {
    return null;
  }

  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid #F5D7D7",
        background: "#FCEEEE",
        color: "#B54848",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 700 }}>Degraded mode</div>
      <div style={{ fontSize: 14, lineHeight: 1.45 }}>
        The Control Plane is not responding normally. Read operations may fail or show stale
        data. Avoid sensitive operations until system health recovers.
      </div>
    </div>
  );
}