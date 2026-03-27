import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useDeployments(params?: { action?: string }) {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["deployments", params],
    queryFn: async () => {
      const response = await apiClient.get("/deployments/history", {
        params,
      });
      return response.data.items;
    },
    enabled: status === "authenticated",
  });
}