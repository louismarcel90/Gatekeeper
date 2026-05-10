"use client";

import { create } from "zustand";
import { RealtimeDomainEvent } from "@/src/modules/realtime/domain-event-stream";

type RealtimeConnectionState = "connected" | "disconnected" | "reconnecting" | "degraded";

type RealtimeEventState = {
  connectionState: RealtimeConnectionState;
  lastEventAt: string | null;
  lastRejectedEventReason: string | null;
  events: RealtimeDomainEvent[];
  setConnectionState: (connectionState: RealtimeConnectionState) => void;
  pushEvent: (event: RealtimeDomainEvent) => void;
  setRejectedEventReason: (reason: string | null) => void;
  clearEvents: () => void;
};

export const useRealtimeEventStore = create<RealtimeEventState>((set) => ({
  connectionState: "disconnected",
  lastEventAt: null,
  lastRejectedEventReason: null,
  events: [],

  setConnectionState: (connectionState) =>
    set({
      connectionState,
    }),

  pushEvent: (event) =>
    set((state) => ({
      lastEventAt: event.occurred_at,
      events: [event, ...state.events]
        .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
        .slice(0, 500),
    })),

  setRejectedEventReason: (reason) =>
    set({
      lastRejectedEventReason: reason,
    }),

  clearEvents: () =>
    set({
      events: [],
    }),
}));
