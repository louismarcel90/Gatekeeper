import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useAuditLogs(params?: {
  decision?: string;
  reason_code?: string;
  client_id?: string;
}) {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      const response = await apiClient.get("/audit/decisions", {
        params,
      });
      return response.data.items;
    },
    enabled: status === "authenticated",
  });
}