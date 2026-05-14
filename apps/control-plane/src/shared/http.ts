import { FastifyReply } from "fastify";

export function sendBadRequest(reply: FastifyReply, message: string) {
  return reply.code(400).send({
    error: "BAD_REQUEST",
    message,
  });
}

export function sendNotFound(reply: FastifyReply, message: string) {
  return reply.code(404).send({
    error: "NOT_FOUND",
    message,
  });
}

export function sendInternalError(reply: FastifyReply, message: string) {
  return reply.code(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message,
  });
}
