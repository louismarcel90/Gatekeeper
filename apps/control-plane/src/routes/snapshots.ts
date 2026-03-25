import { FastifyInstance } from "fastify";
import {
  activateSnapshotVersion,
  getActiveSnapshot,
  getLatestSnapshot,
  listSnapshots,
  publishSnapshot,
  rollbackToSnapshotVersion,
} from "../application/snapshot-service";
import { sendInternalError, sendNotFound } from "../shared/http";

export async function registerSnapshotRoutes(app: FastifyInstance) {
  app.get("/snapshots", async () => {
    return {
      items: await listSnapshots(),
    };
  });

  app.get("/snapshots/latest", async (req, reply) => {
    const snapshot = await getLatestSnapshot();

    if (!snapshot) {
      return sendNotFound(reply, "No snapshot has been published yet.");
    }

    return snapshot;
  });

  app.get("/snapshots/active", async (req, reply) => {
    const snapshot = await getActiveSnapshot();

    if (!snapshot) {
      return sendNotFound(reply, "No active snapshot exists yet.");
    }

    return snapshot;
  });

  app.post("/snapshots/publish", async (req, reply) => {
    const snapshot = await publishSnapshot();
    return reply.code(201).send(snapshot);
  });

  app.post("/snapshots/:version/activate", async (req, reply) => {
    const params = req.params as { version: string };
    const version = Number(params.version);

    if (Number.isNaN(version)) {
      return reply.code(400).send({
        error: "BAD_REQUEST",
        message: "Snapshot version must be a number.",
      });
    }

    try {
      const snapshot = await activateSnapshotVersion(version);
      return reply.code(200).send(snapshot);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while activating snapshot.";

      if (message.includes("was not found")) {
        return sendNotFound(reply, message);
      }

      return sendInternalError(reply, message);
    }
  });

  app.post("/snapshots/:version/rollback", async (req, reply) => {
    const params = req.params as { version: string };
    const version = Number(params.version);

    if (Number.isNaN(version)) {
      return reply.code(400).send({
        error: "BAD_REQUEST",
        message: "Snapshot version must be a number.",
      });
    }

    try {
      const snapshot = await rollbackToSnapshotVersion(version);
      return reply.code(200).send(snapshot);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while rolling back snapshot.";

      if (message.includes("was not found")) {
        return sendNotFound(reply, message);
      }

      return sendInternalError(reply, message);
    }
  });
}