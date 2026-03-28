import { createRequestId } from "@/src/core/observability/request-id";
import { useUiEventsStore } from "./ui-events-store";

type LogInput = {
  level: "info" | "success" | "error";
  scope: string;
  message: string;
  request_id?: string;
  meta?: Record<string, unknown>;
};

export function logUiEvent(input: LogInput): string {
  const requestId = input.request_id ?? createRequestId();

  useUiEventsStore.getState().pushEvent({
    id: `${requestId}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    level: input.level,
    scope: input.scope,
    message: input.message,
    request_id: requestId,
    meta: input.meta,
  });

  return requestId;
}
