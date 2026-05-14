import { z } from "zod";
import "dotenv/config";

const gatewayEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(3002),

  REDIS_URL: z.string().min(1),

  SNAPSHOT_FILE_PATH: z.string().min(1),

  GATEWAY_INSTANCE_ID: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  CONTROL_PLANE_BASE_URL: z.string().min(1),

  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),

  QUOTA_WINDOW_SECONDS: z.coerce.number().int().positive().default(86400),

  OTEL_SERVICE_NAME: z.string().min(1),

  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().min(1),

  OTEL_TRACING_ENABLED: z
    .string()
    .default("false")
    .transform((value) => value === "true"),

  SNAPSHOT_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
});

type GatewayEnv = z.infer<typeof gatewayEnvSchema>;

function parseEnv(): GatewayEnv {
  const result = gatewayEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid Gateway environment configuration.");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
