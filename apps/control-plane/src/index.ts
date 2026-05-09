import cors from "@fastify/cors";
import Fastify from "fastify";
import { controlPlaneConfig } from "./config/env";
import { initDatabase } from "./db/init";
import { attachRequestContext } from "./middleware/request-context";
import { registerAdminUserRoutes } from "./routes/admin-users";
import { registerAuditRoutes } from "./routes/audit";
import { registerAuthRoutes } from "./routes/auth";
import { registerCandidateSimulationRoutes } from "./routes/candidate-simulation";
import { registerDeploymentRoutes } from "./routes/deployments";
import { registerDevAdminUserRoutes } from "./routes/dev-admin-users";
import { registerHealthRoutes } from "./routes/health";
import { registerPolicyDocumentRoutes } from "./routes/policy-documents";
import { registerManagedRouteRoutes } from "./routes/routes";
import { registerPolicyRoutes } from "./routes/policies";
import { registerSimulationRoutes } from "./routes/simulation";
import { registerSnapshotRoutes } from "./routes/snapshots";
import { registerRuntimeRoutes } from "./routes/runtime";
import { registerControlPlaneInstanceRoutes } from "./routes/control-plane-instance";
import { registerSnapshotDiffRoutes } from "./routes/snapshot-diff";
import { registerDomainEventLogger } from "./events/domain-event-logger";
import { registerDevEventRoutes } from "./routes/dev-events";

const app = Fastify({
  logger: true,
});

registerDomainEventLogger();

async function buildServer() {
  app.addHook("onRequest", attachRequestContext);

  await initDatabase();
  await registerHealthRoutes(app);
  await registerAuthRoutes(app);
  await registerDevAdminUserRoutes(app);
  await registerAdminUserRoutes(app);
  await registerManagedRouteRoutes(app);
  await registerPolicyRoutes(app);
  await registerSnapshotRoutes(app);
  await registerAuditRoutes(app);
  await registerSimulationRoutes(app);
  await registerPolicyDocumentRoutes(app);
  await registerCandidateSimulationRoutes(app);
  await registerDeploymentRoutes(app);
  await registerRuntimeRoutes(app);
  await registerControlPlaneInstanceRoutes(app);
  await registerSnapshotDiffRoutes(app);
  await registerDevEventRoutes(app);

  return app;
}

async function start() {
  try {
    await buildServer();

    await app.register(cors, {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id", "x-client-name", "Accept"],
      exposedHeaders: ["x-request-id"],
      preflight: true,
      optionsSuccessStatus: 204,
    });

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
