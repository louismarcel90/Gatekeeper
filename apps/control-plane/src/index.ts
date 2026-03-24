import Fastify from "fastify";
import { registerHealthRoutes } from "./routes/health";
import { registerManagedRouteRoutes } from "./routes/routes";
import { registerPolicyRoutes } from "./routes/policies";
import { registerSnapshotRoutes } from "./routes/snapshots";

const app = Fastify({
  logger: true
});

async function buildServer() {
  await registerHealthRoutes(app);
  await registerManagedRouteRoutes(app);
  await registerPolicyRoutes(app);
  await registerSnapshotRoutes(app);

  return app;
}

async function start() {
  try {
    await buildServer();
    await app.listen({
      port: 3001,
      host: "0.0.0.0"
    });

    app.log.info("Control Plane running on port 3001");
  } catch (error) {
    app.log.error(error, "Failed to start Control Plane");
    process.exit(1);
  }
}

void start();