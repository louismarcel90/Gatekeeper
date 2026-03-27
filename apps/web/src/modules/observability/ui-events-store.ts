import { create } from "zustand";

export type UiEventLevel = "info" | "success" | "error";

export type UiEvent = {
  id: string;
  timestamp: string;
  level: UiEventLevel;
  scope: string;
  message: string;
  request_id?: string;
  meta?: Record<string, unknown>;
};

type UiEventsState = {
  events: UiEvent[];
  pushEvent: (event: UiEvent) => void;
  clearEvents: () => void;
};

const MAX_EVENTS = 40;

export const useUiEventsStore = create<UiEventsState>((set) => ({
  events: [],
  pushEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, MAX_EVENTS),
    })),
  clearEvents: () => set({ events: [] }),
}));