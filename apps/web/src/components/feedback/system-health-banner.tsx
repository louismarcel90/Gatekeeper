"use client";

import { useFrontendHealthStore } from "@/src/core/state/frontend-health-store";

function getBannerStyle(status: "healthy" | "degraded" | "unavailable") {
  if (status === "unavailable") {
    return {
      border: "#F2B8B5",
      background: "#FFF7F7",
      color: "#B54848",
      label: "System unavailable",
    };
  }

  if (status === "degraded") {
    return {
      border: "#E8D1A8",
      background: "#FFF9EF",
      color: "#9A6A2C",
      label: "System degraded",
    };
  }

  return {
    border: "#BFE8D4",
    background: "#F1FBF6",
    color: "#168A4A",
    label: "System healthy",
  };
}

export function SystemHealthBanner() {
  const dependencies = useFrontendHealthStore((state) => state.dependencies);
  const getOverallStatus = useFrontendHealthStore((state) => state.getOverallStatus);

  const status = getOverallStatus();

  if (status === "healthy") {
    return null;
  }

  const style = getBannerStyle(status);
  const affected = dependencies.filter(
    (dependency) => dependency.status !== "healthy",
  );

  return (
    <div
      style={{
        border: `1px solid ${style.border}`,
        background: style.background,
        color: style.color,
        borderRadius: 16,
        padding: 14,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800 }}>{style.label}</div>

      <div style={{ display: "grid", gap: 6 }}>
        {affected.map((dependency) => (
          <div
            key={dependency.name}
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: "#44403C",
            }}
          >
            <strong>{dependency.name}</strong> — {dependency.reason}
          </div>
        ))}
      </div>
    </div>
  );
}