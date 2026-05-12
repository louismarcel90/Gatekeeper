import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export type AdminAuditEventItem = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  request_id: string | null;
  metadata: Record<string, string | number | boolean | null>;
  created_at: string;
};

export function useAdminAuditEvents() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["admin-audit", "events"],
    queryFn: async () => {
      const response = await apiClient.get<{ items: AdminAuditEventItem[] }>(
        "/admin-audit/events",
      );

      return response.data.items;
    },
    enabled: status === "authenticated",
    refetchInterval: 15000,
  });
}