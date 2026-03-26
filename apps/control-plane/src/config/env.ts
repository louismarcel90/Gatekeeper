export const controlPlaneConfig = {
  port: Number(process.env.CONTROL_PLANE_PORT ?? 3001),
  host: process.env.CONTROL_PLANE_HOST ?? "0.0.0.0",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://gatekeeper:gatekeeper@127.0.0.1:55432/gatekeeper",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET ?? "gatekeeper-admin-secret",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL ?? "admin@gatekeeper.local",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? "admin123456",
};