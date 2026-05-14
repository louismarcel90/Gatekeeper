"use client";

import { useUiEventsStore } from "@/src/modules/observability/ui-events-store";
import { StatusBadge } from "@/src/components/data-display/status-badge";
import { ActionButton } from "@/src/components/controls/action-button";

export function RecentUiEvents() {
  const events = useUiEventsStore((state) => state.events);
  const clearEvents = useUiEventsStore((state) => state.clearEvents);

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        borderRadius: 16,
        border: "1px solid #E7E5E4",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111111" }}>Recent UI Events</div>

        <ActionButton tone="neutral" onClick={clearEvents} disabled={events.length === 0}>
          Clear
        </ActionButton>
      </div>

      {events.length === 0 ? (
        <div style={{ color: "#6B665F", fontSize: 14 }}>No recent UI events yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {events.slice(0, 8).map((event) => (
            <div
              key={event.id}
              style={{
                display: "grid",
                gap: 6,
                padding: 12,
                borderRadius: 12,
                background: "#FAFAF9",
                border: "1px solid #ECE8E5",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <StatusBadge
                  tone={
                    event.level === "success"
                      ? "green"
                      : event.level === "error"
                        ? "red"
                        : "neutral"
                  }
                >
                  {event.level}
                </StatusBadge>

                <div style={{ fontSize: 12, color: "#78716C" }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div style={{ fontWeight: 600, color: "#111111", fontSize: 14 }}>{event.scope}</div>

              <div style={{ color: "#5F5B53", fontSize: 14 }}>{event.message}</div>

              {event.request_id ? (
                <div style={{ fontSize: 12, color: "#78716C" }}>request_id: {event.request_id}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
