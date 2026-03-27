import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    requestContext?: {
      requestId: string;
    };
  }
}

function readHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function attachRequestContext(req: FastifyRequest, reply: FastifyReply) {
  const incomingRequestId = readHeader(req.headers, "x-request-id");
  const requestId = incomingRequestId?.trim() || randomUUID();

  req.requestContext = {
    requestId,
  };

  reply.header("x-request-id", requestId);
}