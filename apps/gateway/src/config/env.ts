import dotenv from "dotenv";

dotenv.config();

export const gatewayConfig = {
  port: Number(process.env.GATEWAY_PORT ?? 3002),
  host: process.env.GATEWAY_HOST ?? "0.0.0.0",
  controlPlaneBaseUrl: process.env.CONTROL_PLANE_BASE_URL ?? "http://localhost:3001",
  snapshotPollIntervalMs: Number(process.env.SNAPSHOT_POLL_INTERVAL_MS ?? 5000),
};