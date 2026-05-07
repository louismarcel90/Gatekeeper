import { z } from "zod";

const envSchema = z.object({
  GATEWAY_PORT: z.coerce.number().default(3002),
  GATEWAY_HOST: z.string().default("0.0.0.0"),

  CONTROL_PLANE_BASE_URL: z.string().url().default("http://127.0.0.1:3001"),

  JWT_SECRET: z.string().min(1).default("super-secret-development-key"),

  SNAPSHOT_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5000),

  REDIS_URL: z.string().url().default("redis://127.0.0.1:56379"),

 REDIS_HOST: z.string().default("127.0.0.1"),

REDIS_PORT: z.coerce.number().int().positive().default(6379),

RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid gateway environment variables",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

const parsed = parsedEnv.data;

export const env = {
  PORT: parsed.GATEWAY_PORT,
  HOST: parsed.GATEWAY_HOST,
  CONTROL_PLANE_BASE_URL: parsed.CONTROL_PLANE_BASE_URL,
  JWT_SECRET: parsed.JWT_SECRET,
  SNAPSHOT_POLL_INTERVAL_MS: parsed.SNAPSHOT_POLL_INTERVAL_MS,
  REDIS_URL: parsed.REDIS_URL,
  REDIS_HOST: parsed.REDIS_HOST ?? "127.0.0.1",

  REDIS_PORT: Number(
    parsed.REDIS_PORT ?? "6379",
  ),

  RATE_LIMIT_WINDOW_SECONDS: Number(
    parsed.RATE_LIMIT_WINDOW_SECONDS ?? "60",
  ),
};