import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";
import { logUiEvent } from "@/src/modules/observability/logger";
import { notifyError, notifySuccess, notifyWarning } from "../notifications/domain-notifications";

export function useSnapshots() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["snapshots"],
    queryFn: async () => {
      const response = await apiClient.get("/snapshots");
      return response.data.items;
    },
    enabled: status === "authenticated",
    refetchInterval: 12000,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
}

export function useActiveSnapshot() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["snapshots", "active"],
    queryFn: async () => {
      const response = await apiClient.get("/snapshots/active");
      return response.data;
    },
    enabled: status === "authenticated",
    refetchInterval: 8000,
    staleTime: 4000,
    refetchOnWindowFocus: true,
  });
}

export function usePublishSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logUiEvent({
        level: "info",
        scope: "snapshots.publish",
        message: "Publishing snapshot from UI",
      });

      const response = await apiClient.post("/snapshots/publish");
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "snapshots.publish",
        message: `Snapshot v${data.version} published successfully`,
        meta: { version: data.version },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);
      notifySuccess("Snapshot published", "A new snapshot was published successfully.");
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "snapshots.publish",
        message: "Snapshot publish failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });

      notifyError("Snapshot publish failed", "The snapshot could not be published.");
    },
  });
}

export function useActivateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (version: number) => {
      logUiEvent({
        level: "info",
        scope: "snapshots.activate",
        message: `Activating snapshot v${version}`,
        meta: { version },
      });

      const response = await apiClient.post(`/snapshots/${version}/activate`);
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "snapshots.activate",
        message: `Snapshot v${data.version} activated successfully`,
        meta: { version: data.version },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);

      notifySuccess("Snapshot activated", "The selected snapshot is now active.");
    },
    onError: (error, version) => {
      logUiEvent({
        level: "error",
        scope: "snapshots.activate",
        message: `Failed to activate snapshot v${version}`,
        meta: {
          version,
          error: error instanceof Error ? error.message : "unknown error",
        },
      });

      notifyError("Snapshot activation failed", "The selected snapshot could not be activated.");
    },
  });
}

export function useRollbackSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (version: number) => {
      logUiEvent({
        level: "info",
        scope: "snapshots.rollback",
        message: `Rolling back to snapshot v${version}`,
        meta: { version },
      });

      const response = await apiClient.post(`/snapshots/${version}/rollback`);
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "snapshots.rollback",
        message: `Rollback to snapshot v${data.version} completed successfully`,
        meta: { version: data.version },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);
      notifyWarning(
        "Rollback completed",
        "The runtime configuration was rolled back to a previous snapshot.",
      );
    },
    onError: (error, version) => {
      logUiEvent({
        level: "error",
        scope: "snapshots.rollback",
        message: `Failed to rollback to snapshot v${version}`,
        meta: {
          version,
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
      notifyError("Rollback failed", "The rollback operation could not be completed.");
    },
  });
}
