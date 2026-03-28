import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { gatewayConfig } from "../config/env";

export async function registerDevAuthRoutes(app: FastifyInstance) {
  app.post("/_dev/token", async (req, reply) => {
    const body = (req.body ?? {}) as {
      sub?: string;
      client_id?: string;
      scope?: string;
      expires_in_seconds?: number;
    };

    const token = jwt.sign(
      {
        sub: body.sub ?? "user-123",
        client_id: body.client_id,
        scope: body.scope ?? "",
      },
      gatewayConfig.jwtSecret,
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
