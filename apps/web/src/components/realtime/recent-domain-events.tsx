"use client";

import { useRealtimeEventStore } from "@/src/core/state/realtime-event-store";
import { SectionCard } from "../data-display/section-card";
import { StatusBadge } from "../data-display/status-badge";
import { ActionButton } from "../controls/action-button";
import { useMemo } from "react";
import { PerformanceNote } from "../performance/performance-note";
import { VirtualList } from "../performance/virtual-list";

type ConnectionState = "connected" | "disconnected" | "reconnecting" | "degraded";

function getTone(eventName: string): "green" | "gold" | "red" | "violet" {
  if (eventName.includes("rollback")) {
    return "gold";
  }

  if (eventName.includes("updated") || eventName.includes("activated")) {
    return "violet";
  }

  if (eventName.includes("created") || eventName.includes("published")) {
    return "green";
  }

  return "violet";
}

function getConnectionTone(state: ConnectionState): "green" | "gold" | "red" | "violet" {
  if (state === "connected") {
    return "green";
  }

  if (state === "reconnecting") {
    return "violet";
  }

  if (state === "degraded") {
    return "gold";
  }

  return "red";
}

export function RecentDomainEvents() {
  const connectionState = useRealtimeEventStore((state) => state.connectionState);
  const lastEventAt = useRealtimeEventStore((state) => state.lastEventAt);
  const lastRejectedEventReason = useRealtimeEventStore((state) => state.lastRejectedEventReason);
  const events = useRealtimeEventStore((state) => state.events);
  const clearEvents = useRealtimeEventStore((state) => state.clearEvents);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
      ),
    [events],
  );

  return (
    <SectionCard title="Realtime Events">
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge tone={getConnectionTone(connectionState)}>{connectionState}</StatusBadge>

            {lastEventAt ? (
              <span style={{ fontSize: 13, color: "#6B665F" }}>
                Last event: {new Date(lastEventAt).toLocaleString()}
              </span>
            ) : null}

            {lastRejectedEventReason ? (
              <span style={{ fontSize: 13, color: "#9A6A2C" }}>
                Rejected: {lastRejectedEventReason}
              </span>
            ) : null}
          </div>

          <ActionButton tone="neutral" onClick={clearEvents}>
            Clear
          </ActionButton>
        </div>

        <PerformanceNote>
          Realtime events are rendered through a virtualized list so the dashboard remains usable
          when operational activity grows.
        </PerformanceNote>

        {sortedEvents.length === 0 ? (
          <div style={{ color: "#6B665F", fontSize: 14 }}>No realtime events yet.</div>
        ) : (
          <VirtualList
            items={sortedEvents}
            height={360}
            estimateSize={96}
            renderItem={(event) => (
              <div
                style={{
                  borderBottom: "1px solid #F1EFED",
                  padding: 12,
                  background: "#FFFFFF",
                  display: "grid",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <StatusBadge tone={getTone(event.name)}>{event.name}</StatusBadge>
                  <span style={{ fontSize: 12, color: "#78716C" }}>
                    {new Date(event.occurred_at).toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: 14, fontWeight: 700 }}>{event.payload.resource_id}</div>

                <div style={{ fontSize: 13, color: "#6B665F" }}>
                  {event.payload.resource_type} · {event.payload.action}
                </div>
              </div>
            )}
          />
        )}
      </div>
    </SectionCard>
  );
}
