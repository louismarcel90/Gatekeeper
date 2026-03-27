import { FastifyRequest } from "fastify";

export function getRequestId(req: FastifyRequest): string | null {
  return req.requestContext?.requestId ?? null;
}

export function getActor(req: FastifyRequest): {
  actor_user_id: string | null;
  actor_email: string | null;
} {
  return {
    actor_user_id: req.adminUser?.id ?? null,
    actor_email: req.adminUser?.email ?? null,
  };
}