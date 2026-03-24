import Fastify from "fastify";
import { gatewayConfig } from "./config/env";
import { buildContext } from "./core/context";
import { evaluateWithSnapshot } from "./core/decision-engine";
import { logRequest } from "./middleware/logger";
import { registerDebugRoutes } from "./routes/debug";
import { loadSnapshotOnStartup, startSnapshotPolling } from "./services/snapshot-sync";
import { snapshotStore } from "./services/snapshot-store";

const app = Fastify({ logger: true });

async function registerRoutes() {
  await registerDebugRoutes(app);

  app.all("/*", async (req, reply) => {
    const context = buildContext(req);
    const snapshot = snapshotStore.getSnapshot();
    const decision = evaluateWithSnapshot(context, snapshot);

    logRequest(req, decision);

    if (decision.decision === "DENY") {
      return reply.code(403).send(decision);
    }

    if (decision.decision === "THROTTLE") {
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
      },
      "Gateway running",
    );
  } catch (error) {
    app.log.error(error, "Failed to start Gateway");
    process.exit(1);
  }
}

void start();