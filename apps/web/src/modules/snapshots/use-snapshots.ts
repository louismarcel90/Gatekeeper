import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useSnapshots() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["snapshots"],
    queryFn: async () => {
      const response = await apiClient.get("/snapshots");
      return response.data.items;
    },
    enabled: status === "authenticated",
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
  });
}

export function usePublishSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/snapshots/publish");
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);
    },
  });
}

export function useActivateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (version: number) => {
      const response = await apiClient.post(`/snapshots/${version}/activate`);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);
    },
  });
}

export function useRollbackSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (version: number) => {
      const response = await apiClient.post(`/snapshots/${version}/rollback`);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots", "active"] }),
        queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      ]);
    },
  });
}