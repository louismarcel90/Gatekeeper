import Fastify from "fastify";
import { env } from "./config/env";
import { buildContext } from "./core/context";
import { evaluateWithSnapshot } from "./core/decision-engine";
import { connectRedis } from "./infrastructure/redis-client";
import { logRequest } from "./middleware/logger";
import { registerDevAuthRoutes } from "./routes/dev-auth";
import { registerDebugRoutes } from "./routes/debug";
import { dispatchDecisionAudit } from "./services/audit-dispatcher";
import { loadSnapshotOnStartup, startSnapshotPolling } from "./services/snapshot-sync";
import { snapshotStore } from "./services/snapshot-store";
import { startRuntimeInfrastructure } from "./bootstrap/start-runtime";
import { registerRuntimeMetricsRoute } from "./routes/runtime-metrics-route";
import { registerRuntimeHealthRoute } from "./routes/runtime-health-route";
import { registerRuntimeSnapshotRoute } from "./routes/runtime-snapshot-route";
import { registerRuntimeConsistencyRoute } from "./routes/runtime-consistency-route";
import { registerRuntimeInstanceRoute } from "./routes/runtime-instance-route";
import { startTracing } from "./observability/tracing";
import { attachRequestTraceContext } from "./observability/request-tracing";
import { registerRuntimeDashboardRoute } from "./routes/runtime-dashboard-route";

startTracing();
const app = Fastify({ logger: true });

app.addHook("onRequest", attachRequestTraceContext);
app.addHook("onSend", async (_, reply) => {
  reply.header("X-Frame-Options", "DENY");
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("Referrer-Policy", "no-referrer");
  reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  reply.header("X-XSS-Protection", "0");
});

async function registerRoutes() {
  await registerDebugRoutes(app);
  await registerDevAuthRoutes(app);
  await registerRuntimeSnapshotRoute(app);
  await registerRuntimeMetricsRoute(app);
  await registerRuntimeHealthRoute(app);
  await registerRuntimeConsistencyRoute(app);
  await registerRuntimeInstanceRoute(app);
  await registerRuntimeDashboardRoute(app);

  app.all("/*", async (req, reply) => {
    const context = buildContext(req);
    const snapshot = snapshotStore.getSnapshot();
    if (!snapshot) {
      return reply.code(503).send({
        decision: "DENY",
        reason_code: "SNAPSHOT_MISSING",
        explanation: "No active runtime snapshot is loaded.",
        timestamp: new Date().toISOString(),
      });
    }
    const decision = await evaluateWithSnapshot(snapshot, context);

    logRequest(req, decision);
    dispatchDecisionAudit(app.log, { context, decision });

    if (decision.decision === "DENY") {
      return reply.code(403).send(decision);
    }

    if (decision.decision === "THROTTLE") {
      if (decision.rate_limit?.retry_after_seconds) {
        reply.header("Retry-After", String(decision.rate_limit.retry_after_seconds));
      }

      if (decision.quota?.retry_after_seconds) {
        reply.header("Retry-After", String(decision.quota.retry_after_seconds));
      }

      return reply.code(429).send(decision);
    }

    return reply.code(200).send({
      ok: true,
      decision,
    });
  });
}

async function start() {
  try {
    await connectRedis();
    await loadSnapshotOnStartup();
    startSnapshotPolling();
    await registerRoutes();
    await startRuntimeInfrastructure();

    await app.listen({ port: env.PORT });

    app.log.info(
      {
        port: env.PORT,
        controlPlaneBaseUrl: env.CONTROL_PLANE_BASE_URL,
        snapshotPollIntervalMs: env.SNAPSHOT_POLL_INTERVAL_MS,
      },
      "Gateway running",
    );
  } catch (error) {
    app.log.error(error, "Failed to start Gateway");
    process.exit(1);
  }
}

void start();
