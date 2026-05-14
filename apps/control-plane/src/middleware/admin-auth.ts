import { FastifyReply, FastifyRequest } from "fastify";
import { verifyAdminToken } from "../application/auth-service";
import { AdminRole } from "../domain/types";

declare module "fastify" {
  interface FastifyRequest {
    adminUser?: {
      id: string;
      email: string;
      role: AdminRole;
    };
  }
}

function extractBearerToken(headers: Record<string, string | string[] | undefined>): string | null {
  const raw = headers["authorization"];
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (!value || !value.startsWith("Bearer ")) {
    return null;
  }

  return value.slice("Bearer ".length).trim();
}

export async function requireAdminAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = extractBearerToken(req.headers);

  if (!token) {
    return reply.code(401).send({
      error: "UNAUTHORIZED",
      message: "Missing admin bearer token.",
    });
  }

  try {
    const payload = verifyAdminToken(token);

    req.adminUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return reply.code(401).send({
      error: "UNAUTHORIZED",
      message: "Invalid admin token.",
    });
  }
}

export function requireRole(allowedRoles: AdminRole[]) {
  return async function roleGuard(req: FastifyRequest, reply: FastifyReply) {
    if (!req.adminUser) {
      return reply.code(401).send({
        error: "UNAUTHORIZED",
        message: "Missing authenticated admin user.",
      });
    }

    if (!allowedRoles.includes(req.adminUser.role)) {
      return reply.code(403).send({
        error: "FORBIDDEN",
        message: `Role "${req.adminUser.role}" cannot perform this action.`,
      });
    }
  };
}
