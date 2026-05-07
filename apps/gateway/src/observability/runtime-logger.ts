type LogLevel = "INFO" | "WARN" | "ERROR";

type LogMetadata = Record<string, string | number | boolean | null | undefined>;

function writeLog(
  level: LogLevel,
  message: string,
  metadata: LogMetadata = {},
): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    service: "gatekeeper-gateway",
    instance_id: "gateway-local",
    message,
    ...metadata,
  };

  console.log(JSON.stringify(payload));
}

export const runtimeLogger = {
  info(message: string, metadata?: LogMetadata): void {
    writeLog("INFO", message, metadata);
  },

  warn(message: string, metadata?: LogMetadata): void {
    writeLog("WARN", message, metadata);
  },

  error(message: string, metadata?: LogMetadata): void {
    writeLog("ERROR", message, metadata);
  },
};