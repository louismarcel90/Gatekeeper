import Fastify from "fastify";
import { controlPlaneConfig } from "./config/env";
import { initDatabase } from "./db/init";
import { registerAuditRoutes } from "./routes/audit";
import { registerHealthRoutes } from "./routes/health";
import { registerManagedRouteRoutes } from "./routes/routes";
import { registerPolicyRoutes } from "./routes/policies";
import { registerSimulationRoutes } from "./routes/simulation";
import { registerSnapshotRoutes } from "./routes/snapshots";

const app = Fastify({
  logger: true,
});

async function buildServer() {
  await initDatabase();
  await registerHealthRoutes(app);
  await registerManagedRouteRoutes(app);
  await registerPolicyRoutes(app);
  await registerSnapshotRoutes(app);
  await registerAuditRoutes(app);
  await registerSimulationRoutes(app);

  return app;
}

async function start() {
  try {
    await buildServer();

    await app.listen({
      port: controlPlaneConfig.port,
      host: controlPlaneConfig.host,
    });

    app.log.info(
      {
        port: controlPlaneConfig.port,
        host: controlPlaneConfig.host,
        databaseUrl: controlPlaneConfig.databaseUrl,
      },
      "Control Plane running",
    );
  } catch (error) {
    app.log.error(error, "Failed to start Control Plane");
    process.exit(1);
  }
}

void start();