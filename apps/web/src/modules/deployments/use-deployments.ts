import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useDeployments(params?: {
  action?: string;
  request_id?: string;
  actor_email?: string;
  limit?: number;
  offset?: number;
}) {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["deployments", params],
    queryFn: async () => {
      const response = await apiClient.get("/deployments/history", {
        params,
      });
      return response.data;
    },
    enabled: status === "authenticated",
    refetchInterval: 12000,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
}