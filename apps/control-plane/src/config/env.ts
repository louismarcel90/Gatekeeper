import { z } from "zod";
import "dotenv/config";

const controlPlaneEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(3001),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters."),

  REDIS_URL: z.string().min(1),

  HOST: z.string().min(1).default("127.0.0.1"),

  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),

  ADMIN_SEED_EMAIL: z.string().email(),
  ADMIN_SEED_PASSWORD: z.string().min(8),
  ADMIN_JWT_SECRET: z.string().min(32),
  CONTROL_PLANE_INSTANCE_ID: z.string().min(1),
});

type ControlPlaneEnv = z.infer<typeof controlPlaneEnvSchema>;

function parseEnv(): ControlPlaneEnv {
  const result = controlPlaneEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid Control Plane environment configuration.");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
