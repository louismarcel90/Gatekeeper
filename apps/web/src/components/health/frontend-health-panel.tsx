"use client";

import { SectionCard } from "../data-display/section-card";
import { StatusBadge } from "../data-display/status-badge";
import { useFrontendHealthStore } from "@/src/core/state/frontend-health-store";

function getTone(status: "healthy" | "degraded" | "unavailable") {
  if (status === "healthy") {
    return "green";
  }

  if (status === "degraded") {
    return "gold";
  }

  return "red";
}

export function FrontendHealthPanel() {
  const dependencies = useFrontendHealthStore((state) => state.dependencies);
  const getOverallStatus = useFrontendHealthStore((state) => state.getOverallStatus);

  const overallStatus = getOverallStatus();

  return (
    <SectionCard title="Frontend System Health">
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge tone={getTone(overallStatus)}>{overallStatus}</StatusBadge>
          <span style={{ fontSize: 13, color: "#6B665F" }}>
            Frontend health is derived from Control Plane reachability, realtime
            stream state, and auth session readiness.
          </span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {dependencies.map((dependency) => (
            <div
              key={dependency.name}
              style={{
                border: "1px solid #E7E5E4",
                borderRadius: 14,
                padding: 12,
                background: "#FFFFFF",
                display: "grid",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge tone={getTone(dependency.status)}>
                  {dependency.status}
                </StatusBadge>
                <strong style={{ fontSize: 14 }}>{dependency.name}</strong>
              </div>

              <div style={{ fontSize: 13, color: "#6B665F" }}>
                {dependency.reason}
              </div>

              <div style={{ fontSize: 12, color: "#78716C" }}>
                Last checked: {new Date(dependency.lastCheckedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}