import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";
import { logUiEvent } from "@/src/modules/observability/logger";

export type AdminUserItem = {
  id: string;
  email: string;
  role: "viewer" | "security" | "admin";
  created_at?: string;
};

export type CreateAdminUserPayload = {
  email: string;
  password: string;
  role: "viewer" | "security" | "admin";
};

export function useAdminUsers() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await apiClient.get("/admin-users");
      return response.data.items as AdminUserItem[];
    },
    enabled: status === "authenticated",
    refetchInterval: 20000,
    staleTime: 6000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdminUserPayload) => {
      logUiEvent({
        level: "info",
        scope: "adminUsers.create",
        message: `Creating admin user ${payload.email}`,
        meta: {
          email: payload.email,
          role: payload.role,
        },
      });

      const response = await apiClient.post("/admin-users", payload);
      return response.data as AdminUserItem;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "adminUsers.create",
        message: `Admin user ${data.email} created successfully`,
        meta: {
          email: data.email,
          role: data.role,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "adminUsers.create",
        message: "Admin user creation failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    },
  });
}