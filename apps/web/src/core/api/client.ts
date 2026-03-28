import axios from "axios";
import { createRequestId } from "@/src/core/observability/request-id";
import { logUiEvent } from "@/src/modules/observability/logger";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

apiClient.interceptors.request.use((config) => {
  const requestId = createRequestId();

  config.headers["x-request-id"] = requestId;
  config.headers["x-client-name"] = "gatekeeper-web";

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  (config as typeof config & { metadata?: Record<string, unknown> }).metadata = {
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
    const metadata = (
      response.config as typeof response.config & {
        metadata?: { request_id?: string; started_at?: number };
      }
    ).metadata;

    const durationMs =
      typeof metadata?.started_at === "number" ? Date.now() - metadata.started_at : undefined;

    logUiEvent({
      level: "success",
      scope: "http.response",
      message: `${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`,
      request_id: metadata?.request_id,
      meta: {
        status: response.status,
        duration_ms: durationMs,
      },
    });

    return response;
  },
  (error) => {
    const config = error.config as
      | {
          url?: string;
          method?: string;
          metadata?: { request_id?: string; started_at?: number };
        }
      | undefined;

    const durationMs =
      typeof config?.metadata?.started_at === "number"
        ? Date.now() - config.metadata.started_at
        : undefined;

    logUiEvent({
      level: "error",
      scope: "http.response",
      message: `${config?.method?.toUpperCase() ?? "UNKNOWN"} ${config?.url ?? "unknown"} → error`,
      request_id: config?.metadata?.request_id,
      meta: {
        duration_ms: durationMs,
        status: error?.response?.status,
        error: error?.message,
      },
    });

    return Promise.reject(error);
  },
);
