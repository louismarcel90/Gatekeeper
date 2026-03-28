import { useAuthStore } from "@/src/core/state/auth-store";
import { AdminRole } from "@/src/modules/auth/types";

export type UiCapability =
  | "snapshots.publish"
  | "snapshots.activate"
  | "snapshots.rollback"
  | "policyDocuments.import"
  | "simulation.candidate"
  | "adminUsers.manage";

const capabilityMatrix: Record<UiCapability, AdminRole[]> = {
  "snapshots.publish": ["security", "admin"],
  "snapshots.activate": ["admin"],
  "snapshots.rollback": ["admin"],
  "policyDocuments.import": ["security", "admin"],
  "simulation.candidate": ["security", "admin"],
  "adminUsers.manage": ["admin"],
};

export function can(role: AdminRole | undefined, capability: UiCapability): boolean {
  if (!role) {
    return false;
  }

  return capabilityMatrix[capability].includes(role);
}

export function useCapability(capability: UiCapability): boolean {
  const role = useAuthStore((state) => state.user?.role);
  return can(role, capability);
}
