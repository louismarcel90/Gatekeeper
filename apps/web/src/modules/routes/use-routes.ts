import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";
import { logUiEvent } from "@/src/modules/observability/logger";
import { notifyError, notifySuccess, notifyWarning } from "../notifications/domain-notifications";

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

      notifySuccess("Route created", `Route ${data.id} was created in the control plane.`);
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

      notifyError(
        "Route creation failed",
        "The route could not be created. Check the input and try again.",
      );
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
      logUiEvent({
        level: "info",
        scope: "routes.lifecycle",
        message: payload.enabled ? `Enabling route ${payload.id}` : `Disabling route ${payload.id}`,
        meta: {
          route_id: payload.id,
          next_enabled: payload.enabled,
        },
      });

      const response = await apiClient.patch(`/routes/${payload.id}/enabled`, {
        enabled: payload.enabled,
      });

      return response.data;
    },
    onSuccess: async (data) => {
      logUiEvent({
        level: "success",
        scope: "routes.lifecycle",
        message: data.message ?? "Route lifecycle updated successfully",
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);

      notifyWarning("Route lifecycle changed", data.message ?? "Route lifecycle was updated.");
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "routes.lifecycle",
        message: "Route lifecycle update failed",
        meta: {
          error: error instanceof Error ? error.message : "unexpected error",
        },
      });
    },
  });
}
