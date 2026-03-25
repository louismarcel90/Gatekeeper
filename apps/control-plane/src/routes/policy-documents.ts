import { FastifyInstance } from "fastify";
import {
  exportPolicyDocument,
  importPolicyDocument,
  validatePolicyDocument,
} from "../application/policy-document-service";
import { policyDocumentSchema } from "../domain/validators";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerPolicyDocumentRoutes(app: FastifyInstance) {
  app.post("/policy-documents/validate", async (req, reply) => {
    const parsed = policyDocumentSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    const result = validatePolicyDocument(parsed.data);

    return reply.code(200).send(result);
  });

  app.post("/policy-documents/import", async (req, reply) => {
    const parsed = policyDocumentSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    try {
      const imported = await importPolicyDocument(parsed.data);
      return reply.code(201).send(imported);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while importing policy document.";
      return sendInternalError(reply, message);
    }
  });

  app.get("/policy-documents/export", async (req, reply) => {
    try {
      const document = await exportPolicyDocument();
      return reply.code(200).send(document);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while exporting policy document.";
      return sendInternalError(reply, message);
    }
  });
}