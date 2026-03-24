import dotenv from "dotenv";

dotenv.config();

export const controlPlaneConfig = {
  port: Number(process.env.CONTROL_PLANE_PORT ?? 3001),
  host: process.env.CONTROL_PLANE_HOST ?? "0.0.0.0",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://gatekeeper:gatekeeper@localhost:5432/gatekeeper",
};