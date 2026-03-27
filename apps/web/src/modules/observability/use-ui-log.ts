import { logUiEvent } from "./logger";

export function useUiLog(scope: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) =>
      logUiEvent({ level: "info", scope, message, meta }),
    success: (message: string, meta?: Record<string, unknown>) =>
      logUiEvent({ level: "success", scope, message, meta }),
    error: (message: string, meta?: Record<string, unknown>) =>
      logUiEvent({ level: "error", scope, message, meta }),
  };
}