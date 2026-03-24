import Fastify from "fastify";
import { gatewayConfig } from "./config/env";
import { buildContext } from "./core/context";
import { evaluateWithSnapshot } from "./core/decision-engine";
import { logRequest } from "./middleware/logger";
import { registerDebugRoutes } from "./routes/debug";
import { connectRedis } from "./infrastructure/redis-client";
import { dispatchDecisionAudit } from "./services/audit-dispatcher";
import { loadSnapshotOnStartup, startSnapshotPolling } from "./services/snapshot-sync";
import { snapshotStore } from "./services/snapshot-store";

const app = Fastify({ logger: true });

async function registerRoutes() {
  await registerDebugRoutes(app);

  app.all("/*", async (req, reply) => {
    const context = buildContext(req);
    const snapshot = snapshotStore.getSnapshot();
    const decision = await evaluateWithSnapshot(context, snapshot);

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

    await app.listen({
      port: gatewayConfig.port,
      host: gatewayConfig.host,
    });

    app.log.info(
      {
        port: gatewayConfig.port,
        host: gatewayConfig.host,
        controlPlaneBaseUrl: gatewayConfig.controlPlaneBaseUrl,
        snapshotPollIntervalMs: gatewayConfig.snapshotPollIntervalMs,
        redisUrl: gatewayConfig.redisUrl,
      },
      "Gateway running",
    );
  } catch (error) {
    app.log.error(error, "Failed to start Gateway");
    process.exit(1);
  }
}

void start();