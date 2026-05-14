import { FastifyInstance } from "fastify";
import {
  exportPolicyDocument,
  importPolicyDocument,
  validatePolicyDocument,
} from "../application/policy-document-service";
import { policyDocumentSchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { getActor, getRequestId } from "../shared/request-context";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerPolicyDocumentRoutes(app: FastifyInstance) {
  app.post("/policy-documents/validate", { preHandler: [requireAdminAuth] }, async (req, reply) => {
    const parsed = policyDocumentSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    const result = validatePolicyDocument(parsed.data);

    return reply.code(200).send(result);
  });

  app.post(
    "/policy-documents/import",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const parsed = policyDocumentSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const actor = getActor(req);
        const requestId = getRequestId(req);

        const imported = await importPolicyDocument(parsed.data, {
          request_id: requestId,
          actor_user_id: actor.actor_user_id,
          actor_email: actor.actor_email,
        });

        return reply.code(201).send(imported);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while importing policy document.";
        return sendInternalError(reply, message);
      }
    },
  );

  app.get("/policy-documents/export", { preHandler: [requireAdminAuth] }, async (req, reply) => {
    try {
      const document = await exportPolicyDocument();
      return reply.code(200).send(document);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error while exporting policy document.";
      return sendInternalError(reply, message);
    }
  });
}
