import { z } from "zod";
import "dotenv/config";

const gatewayEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(3002),

  REDIS_URL: z.string().min(1),

  SNAPSHOT_FILE_PATH: z.string().min(1),

  GATEWAY_INSTANCE_ID: z.string().min(1),

  CONTROL_PLANE_BASE_URL: z.string().min(1),

  SNAPSHOT_POLL_INTERVAL_MS: z.coerce
  .number()
  .int()
  .positive()
  .default(5000),
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