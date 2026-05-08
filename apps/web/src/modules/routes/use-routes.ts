import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";
import { logUiEvent } from "@/src/modules/observability/logger";

export type RouteInput = {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  upstream_url: string;
  enabled: boolean;
};

export function useRoutes() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await apiClient.get("/routes");
      return res.data.items;
    },
    enabled: status === "authenticated",
    refetchInterval: 15000,
    staleTime: 6000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RouteInput) => {
      logUiEvent({
        level: "info",
        scope: "routes.create",
        message: `Creating route ${payload.id}`,
        meta: {
          route_id: payload.id,
          path: payload.path,
          method: payload.method,
        },
      });

      const response = await apiClient.post("/routes", payload);
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "routes.create",
        message: `Route ${data.id} created successfully`,
        meta: {
          route_id: data.id,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
      ]);
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "routes.create",
        message: "Route creation failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RouteInput) => {
      logUiEvent({
        level: "info",
        scope: "routes.update",
        message: `Updating route ${payload.id}`,
        meta: {
          route_id: payload.id,
        },
      });

      const response = await apiClient.put(`/routes/${payload.id}`, payload);
      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "routes.update",
        message: `Route ${data.id} updated successfully`,
        meta: {
          route_id: data.id,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);
    },
  });
}

export function useSetRouteEnabled() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; enabled: boolean }) => {
      const response = await apiClient.patch(`/routes/${payload.id}/enabled`, {
        enabled: payload.enabled,
      });

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);
    },
  });
}
