import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

type DevTokenRequestBody = {
  sub?: string;
  client_id?: string;
  scope?: string;
  expires_in_seconds?: number;
};

export async function registerDevAuthRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.post<{ Body: DevTokenRequestBody }>("/_dev/token", async (req, reply) => {
    const body = req.body;

    const token = jwt.sign(
      {
        sub: body.sub ?? "user-123",
        client_id: body.client_id,
        scope: body.scope ?? "",
      },
      env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: body.expires_in_seconds ?? 3600,
      },
    );

    return reply.code(201).send({
      token,
    });
  });
}