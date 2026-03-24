import { FastifyInstance } from "fastify";
import { getLatestSnapshot, publishSnapshot } from "../application/snapshot-service";
import { sendNotFound } from "../shared/http";

export async function registerSnapshotRoutes(app: FastifyInstance) {
  app.get("/snapshots/latest", async (req, reply) => {
    const snapshot = await getLatestSnapshot();

    if (!snapshot) {
      return sendNotFound(reply, "No snapshot has been published yet.");
    }

    return snapshot;
  });

  app.post("/snapshots/publish", async (req, reply) => {
    const snapshot = await publishSnapshot();
    return reply.code(201).send(snapshot);
  });
}