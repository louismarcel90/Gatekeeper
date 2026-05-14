import cors from "@fastify/cors";
import Fastify from "fastify";
import { runStartupSecurityAudit } from "./config/startup-security-audit";
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
import { registerDomainEventStreamSubscriber } from "./events/domain-event-stream-subscriber";
import { registerDomainEventStreamRoutes } from "./routes/domain-events-stream";
import { registerAdminAuditRoutes } from "./routes/admin-audit";
import { env } from "./config/env";

const app = Fastify({
  logger: true,
});

registerDomainEventLogger();
registerDomainEventStreamSubscriber();
runStartupSecurityAudit();

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
  await registerDomainEventStreamRoutes(app);
  await registerAdminAuditRoutes(app);

  return app;
}

app.addHook("onSend", async (_, reply) => {
  reply.header("X-Frame-Options", "DENY");
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("Referrer-Policy", "no-referrer");
  reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  reply.header("X-XSS-Protection", "0");
});

async function start() {
  try {
    await buildServer();

    await app.register(cors, {
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id", "x-client-name", "Accept"],
      exposedHeaders: ["x-request-id"],
      preflight: true,
      optionsSuccessStatus: 204,
    });

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    app.log.info(
      {
        port: env.PORT,
        host: env.HOST,
        databaseUrl: env.DATABASE_URL,
      },
      "Control Plane running",
    );
  } catch (error) {
    app.log.error(error, "Failed to start Control Plane");
    process.exit(1);
  }
}

void start();
