import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";
import { logUiEvent } from "@/src/modules/observability/logger";

export type PolicyInput = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

export function usePolicies() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const response = await apiClient.get("/policies");
      return response.data.items;
    },
    enabled: status === "authenticated",
    refetchInterval: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: true,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PolicyInput) => {
      logUiEvent({
        level: "info",
        scope: "policies.create",
        message: `Creating policy ${payload.id}`,
        meta: {
          policy_id: payload.id,
          route_id: payload.route_id,
        },
      });

      const response = await apiClient.post("/policies", payload);
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "policies.create",
        message: `Policy ${data.id} created successfully`,
        meta: {
          policy_id: data.id,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["policies"] }),
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "policies.create",
        message: "Policy creation failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    },
  });
}
