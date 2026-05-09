"use client";

import { create } from "zustand";
import { RealtimeDomainEvent } from "@/src/modules/realtime/domain-event-stream"; 

type RealtimeEventState = {
  connected: boolean;
  events: RealtimeDomainEvent[];
  setConnected: (connected: boolean) => void;
  pushEvent: (event: RealtimeDomainEvent) => void;
  clearEvents: () => void;
};

export const useRealtimeEventStore = create<RealtimeEventState>((set) => ({
  connected: false,
  events: [],

  setConnected: (connected) =>
    set({
      connected,
    }),

  pushEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 30),
    })),

  clearEvents: () =>
    set({
      events: [],
    }),
}));