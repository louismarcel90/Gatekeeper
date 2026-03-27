import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useAuditLogs(params?: {
  decision?: string;
  reason_code?: string;
  client_id?: string;
  actor_email?: string;
  request_id?: string;
  limit?: number;
  offset?: number;
}) {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      const response = await apiClient.get("/audit/decisions", {
        params,
      });
      return response.data;
    },
    enabled: status === "authenticated",
    refetchInterval: 20000,
    staleTime: 7000,
    refetchOnWindowFocus: true,
  });
}