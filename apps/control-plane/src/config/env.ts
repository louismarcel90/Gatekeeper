export const controlPlaneConfig = {
  port: Number(process.env.CONTROL_PLANE_PORT ?? 3001),
  host: process.env.CONTROL_PLANE_HOST ?? "0.0.0.0",
  databaseUrl:
    process.env.DATABASE_URL ?? "postgresql://gatekeeper:gatekeeper@127.0.0.1:55432/gatekeeper",
  CONTROL_PLANE_INSTANCE_ID: process.env["CONTROL_PLANE_INSTANCE_ID"] ?? "control-plane-local-1",

  adminJwtSecret:
    process.env.ADMIN_JWT_SECRET ?? process.env.JWT_SECRET ?? "super-secret-development-key",

  adminSeedEmail: process.env.ADMIN_SEED_EMAIL ?? "admin@gatekeeper.local",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? "admin123456",
  QUOTA_WINDOW_SECONDS: Number(process.env.QUOTA_WINDOW_SECONDS ?? "86400"),
};
