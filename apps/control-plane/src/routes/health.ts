import { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      ok: true,
      service: "control-plane",
      ts: new Date().toISOString()
    };
  });

  app.get("/metrics", async (_req, reply) => {
    return reply
      .code(200)
      .type("text/plain; version=0.0.4; charset=utf-8")
      .send("# no metrics yet\n");
  });
}