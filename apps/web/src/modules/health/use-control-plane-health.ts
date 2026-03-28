import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

type HealthResponse = {
  ok: boolean;
  service?: string;
};

export function useControlPlaneHealth() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["health", "control-plane"],
    queryFn: async () => {
      const response = await apiClient.get<HealthResponse>("/health");
      return response.data;
    },
    enabled: status === "authenticated",
    refetchInterval: 15000,
    retry: 1,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
}
