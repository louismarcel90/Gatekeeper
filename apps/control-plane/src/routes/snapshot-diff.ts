import { FastifyInstance } from "fastify";
import { compareSnapshots } from "../application/snapshot-diff-service";
import { requireAdminAuth } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError, sendNotFound } from "../shared/http";

function parseVersion(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function registerSnapshotDiffRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/snapshots/diff",
    { preHandler: [requireAdminAuth] },
    async (req, reply) => {
      const query = req.query as {
        from?: string;
        to?: string;
      };

      const fromVersion = parseVersion(query.from);
      const toVersion = parseVersion(query.to);

      if (fromVersion === null || toVersion === null) {
        return sendBadRequest(reply, "Query params from and to must be positive integers.");
      }

      try {
        const diff = await compareSnapshots({
          fromVersion,
          toVersion,
        });

        return reply.code(200).send(diff);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while comparing snapshots.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );
}