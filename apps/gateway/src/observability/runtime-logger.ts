import { env } from "../config/env";
import { getCurrentTraceContext } from "./tracing";

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type LogValue = string | number | boolean | null | string[] | number[] | boolean[];

export type LogFields = Record<string, LogValue>;

function writeStructuredLog(level: LogLevel, message: string, fields: LogFields = {}): void {
  const traceContext = getCurrentTraceContext();

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: "gatekeeper-gateway",
    instance_id: env.GATEWAY_INSTANCE_ID,
    trace_id: traceContext.trace_id,
    span_id: traceContext.span_id,
    message,
    ...fields,
  };

  const serialized = JSON.stringify(entry);

  if (level === "ERROR") {
    console.error(serialized);
    return;
  }

  if (level === "WARN") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export const runtimeLogger = {
  info(message: string, fields?: LogFields): void {
    writeStructuredLog("INFO", message, fields);
  },

  warn(message: string, fields?: LogFields): void {
    writeStructuredLog("WARN", message, fields);
  },

  error(message: string, fields?: LogFields): void {
    writeStructuredLog("ERROR", message, fields);
  },
};
