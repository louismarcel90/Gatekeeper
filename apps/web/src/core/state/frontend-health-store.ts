"use client";

import { create } from "zustand";

export type FrontendHealthStatus = "healthy" | "degraded" | "unavailable";

export type FrontendDependencyStatus = {
  name: "control-plane" | "realtime-stream" | "auth-session";
  status: FrontendHealthStatus;
  reason: string;
  lastCheckedAt: string;
};

type FrontendHealthState = {
  dependencies: FrontendDependencyStatus[];
  setDependencyStatus: (input: {
    name: FrontendDependencyStatus["name"];
    status: FrontendHealthStatus;
    reason: string;
  }) => void;
  getOverallStatus: () => FrontendHealthStatus;
};

const initialDependencies: FrontendDependencyStatus[] = [
  {
    name: "control-plane",
    status: "healthy",
    reason: "Initial state.",
    lastCheckedAt: new Date().toISOString(),
  },
  {
    name: "realtime-stream",
    status: "degraded",
    reason: "Realtime stream not connected yet.",
    lastCheckedAt: new Date().toISOString(),
  },
  {
    name: "auth-session",
    status: "healthy",
    reason: "Initial state.",
    lastCheckedAt: new Date().toISOString(),
  },
];

export const useFrontendHealthStore = create<FrontendHealthState>((set, get) => ({
  dependencies: initialDependencies,

  setDependencyStatus: (input) =>
    set((state) => ({
      dependencies: state.dependencies.map((dependency) =>
        dependency.name === input.name
          ? {
              ...dependency,
              status: input.status,
              reason: input.reason,
              lastCheckedAt: new Date().toISOString(),
            }
          : dependency,
      ),
    })),

  getOverallStatus: () => {
    const dependencies = get().dependencies;

    if (dependencies.some((dependency) => dependency.status === "unavailable")) {
      return "unavailable";
    }

    if (dependencies.some((dependency) => dependency.status === "degraded")) {
      return "degraded";
    }

    return "healthy";
  },
}));