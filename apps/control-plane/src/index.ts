import Fastify from "fastify";
import cors from "@fastify/cors";

import { controlPlaneConfig } from "./config/env";
import { initDatabase } from "./db/init";

import { registerHealthRoutes } from "./routes/health";
import { registerAuthRoutes } from "./routes/auth";
import { registerManagedRouteRoutes } from "./routes/routes";
import { registerPolicyRoutes } from "./routes/policies";
import { registerSnapshotRoutes } from "./routes/snapshots";
import { registerAuditRoutes } from "./routes/audit";
import { registerSimulationRoutes } from "./routes/simulation";
import { registerPolicyDocumentRoutes } from "./routes/policy-documents";
import { registerCandidateSimulationRoutes } from "./routes/candidate-simulation";
import { registerDeploymentRoutes } from "./routes/deployments";

const app = Fastify({
  logger: true,
});

async function buildServer() {
  // 1. Infra init
  await initDatabase();

  // 2. CORS (avant routes)
  await app.register(cors, {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-request-id",
      "x-client-name",
      "Accept",
    ],
    exposedHeaders: ["x-request-id"],
    preflight: true,
    optionsSuccessStatus: 204,
  });

  // 3. OPTIONS fallback global
  // app.options("*", async (_request, reply) => {
  //   reply.send();
  // });

  // 4. Routes
  await registerHealthRoutes(app);
  await registerAuthRoutes(app);

  await registerManagedRouteRoutes(app);
  await registerPolicyRoutes(app);
  await registerSnapshotRoutes(app);

  await registerAuditRoutes(app);
  await registerSimulationRoutes(app);
  await registerCandidateSimulationRoutes(app);
  await registerPolicyDocumentRoutes(app);

  await registerDeploymentRoutes(app);

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
      "Control Plane running"
    );
  } catch (error) {
    app.log.error(error, "Failed to start Control Plane");
    process.exit(1);
  }
}

void start();