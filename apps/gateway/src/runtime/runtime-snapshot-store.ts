import { RuntimePolicy, RuntimeRoute } from "../runtime/runtime-types";

export type ActiveRuntimeSnapshot = {
  version: number;
  routes: RuntimeRoute[];
  policies: RuntimePolicy[];
  loadedAt: string;
};

let activeSnapshot: ActiveRuntimeSnapshot | null = null;

export function setActiveSnapshot(snapshot: ActiveRuntimeSnapshot) {
  activeSnapshot = snapshot;
}

export function getActiveSnapshot(): ActiveRuntimeSnapshot {
  if (!activeSnapshot) {
    throw new Error("No active runtime snapshot loaded.");
  }

  return activeSnapshot;
}