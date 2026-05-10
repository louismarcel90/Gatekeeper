import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { createRequestId } from "../observability/request-id";
import { useFrontendHealthStore } from "../state/frontend-health-store";
import { logUiEvent } from "@/src/modules/observability/logger";

type RequestMetadata = {
  request_id: string;
  started_at: number;
};

type RequestConfigWithMetadata = AxiosRequestConfig & {
  metadata?: RequestMetadata;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CONTROL_PLANE_BASE_URL ?? "http://localhost:3001",
});

apiClient.interceptors.request.use((config) => {
  const requestId = createRequestId();

  config.headers = config.headers ?? {};
  config.headers["x-request-id"] = requestId;
  config.headers["x-client-name"] = "gatekeeper-web";

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const configWithMetadata = config as RequestConfigWithMetadata;

  configWithMetadata.metadata = {
    request_id: requestId,
    started_at: Date.now(),
  };

  logUiEvent({
    level: "info",
    scope: "http.request",
    message: `${config.method?.toUpperCase()} ${config.url}`,
    request_id: requestId,
  });

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const metadata = (response.config as RequestConfigWithMetadata).metadata;

    const durationMs =
      typeof metadata?.started_at === "number" ? Date.now() - metadata.started_at : undefined;

    logUiEvent({
      level: "success",
      scope: "http.response",
      message: `${response.config.method?.toUpperCase()} ${
        response.config.url
      } -> ${response.status}`,
      request_id: metadata?.request_id,
      meta: {
        status: response.status,
        duration_ms: durationMs,
      },
    });

    useFrontendHealthStore.getState().setDependencyStatus({
      name: "control-plane",
      status: "healthy",
      reason: "Control Plane API request succeeded.",
    });

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as RequestConfigWithMetadata | undefined;

    const durationMs =
      typeof config?.metadata?.started_at === "number"
        ? Date.now() - config.metadata.started_at
        : undefined;

    logUiEvent({
      level: "error",
      scope: "http.response",
      message: `${config?.method?.toUpperCase() ?? "UNKNOWN"} ${config?.url ?? "unknown"} -> error`,
      request_id: config?.metadata?.request_id,
      meta: {
        duration_ms: durationMs,
        status: error.response?.status,
        error: error.message,
      },
    });

    useFrontendHealthStore.getState().setDependencyStatus({
      name: "control-plane",
      status: "degraded",
      reason: "A Control Plane API request failed.",
    });

    return Promise.reject(error);
  },
);
