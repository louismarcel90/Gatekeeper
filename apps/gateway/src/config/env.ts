export const gatewayConfig = {
  port: Number(process.env.PORT ?? 3002),
  host: process.env.HOST ?? "0.0.0.0",
  controlPlaneBaseUrl: process.env.CONTROL_PLANE_BASE_URL ?? "http://localhost:3001",
};