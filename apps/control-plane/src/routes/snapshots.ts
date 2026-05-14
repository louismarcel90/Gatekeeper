import { FastifyInstance } from "fastify";
import {
  activateSnapshotVersion,
  getActiveSnapshot,
  getLatestSnapshot,
  listSnapshots,
  publishSnapshot,
  rollbackToSnapshotVersion,
} from "../application/snapshot-service";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { getActor, getRequestId } from "../shared/request-context";
import { sendInternalError, sendNotFound } from "../shared/http";
import { publishDomainEvent } from "../events/domain-event-bus";

export async function registerSnapshotRoutes(app: FastifyInstance) {
  app.get("/snapshots", { preHandler: [requireAdminAuth] }, async () => {
    return {
      items: await listSnapshots(),
    };
  });

  app.get("/snapshots/latest", async (_req, reply) => {
    const snapshot = await getLatestSnapshot();

    if (!snapshot) {
      return sendNotFound(reply, "No snapshot has been published yet.");
    }

    return snapshot;
  });

  app.get("/snapshots/active", async (_req, reply) => {
    const snapshot = await getActiveSnapshot();

    if (!snapshot) {
      return sendNotFound(reply, "No active snapshot exists yet.");
    }

    return snapshot;
  });

  app.post(
    "/snapshots/publish",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      try {
        const actor = getActor(req);
        const requestId = getRequestId(req);

        const snapshot = await publishSnapshot({
          request_id: requestId,
          actor_user_id: actor.actor_user_id,
          actor_email: actor.actor_email,
        });

        await publishDomainEvent({
          name: "snapshot.published",
          payload: {
            resource_id: `snapshot-${snapshot.version}`,
            resource_type: "snapshot",
            action: "publish",
            metadata: {
              version: snapshot.version,
            },
          },
        });

        return reply.code(201).send(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while publishing snapshot.";

        return sendInternalError(reply, message);
      }
    },
  );

  app.post(
    "/snapshots/:version/activate",
    { preHandler: [requireAdminAuth, requireRole(["admin"])] },
    async (req, reply) => {
      const params = req.params as { version: string };
      const version = Number(params.version);

      if (Number.isNaN(version)) {
        return reply.code(400).send({
          error: "BAD_REQUEST",
          message: "Snapshot version must be a number.",
        });
      }

      try {
        const actor = getActor(req);
        const requestId = getRequestId(req);

        const snapshot = await activateSnapshotVersion(version, {
          request_id: requestId,
          actor_user_id: actor.actor_user_id,
          actor_email: actor.actor_email,
        });

        await publishDomainEvent({
          name: "snapshot.activated",
          payload: {
            resource_id: `snapshot-${snapshot.version}`,
            resource_type: "snapshot",
            action: "activate",
            metadata: {
              version: snapshot.version,
            },
          },
        });

        return reply.code(200).send(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while activating snapshot.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );

  app.post(
    "/snapshots/:version/rollback",
    { preHandler: [requireAdminAuth, requireRole(["admin"])] },
    async (req, reply) => {
      const params = req.params as { version: string };
      const version = Number(params.version);

      if (Number.isNaN(version)) {
        return reply.code(400).send({
          error: "BAD_REQUEST",
          message: "Snapshot version must be a number.",
        });
      }

      try {
        const actor = getActor(req);
        const requestId = getRequestId(req);

        const snapshot = await rollbackToSnapshotVersion(version, {
          request_id: requestId,
          actor_user_id: actor.actor_user_id,
          actor_email: actor.actor_email,
        });

        await publishDomainEvent({
          name: "snapshot.rollback_completed",
          payload: {
            resource_id: `snapshot-${snapshot.version}`,
            resource_type: "snapshot",
            action: "rollback",
            metadata: {
              version: snapshot.version,
            },
          },
        });

        return reply.code(200).send(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while rolling back snapshot.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );
}
