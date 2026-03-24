import Fastify from "fastify";
import { buildContext } from "./core/context";
import { evaluate } from "./core/decision-engine";
import { logRequest } from "./middleware/logger";

const app = Fastify({ logger: true });

app.all("/*", async (req, reply) => {
  const context = buildContext(req);
  const decision = evaluate(context);

  logRequest(req, decision);

  if (decision.decision === "DENY") {
    return reply.code(403).send(decision);
  }

  if (decision.decision === "THROTTLE") {
    return reply.code(429).send(decision);
  }

  return { ok: true, decision };
});

app.listen({ port: 3002, host: "0.0.0.0" });