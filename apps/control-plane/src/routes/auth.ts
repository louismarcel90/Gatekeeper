import { FastifyInstance } from "fastify";
import { getAdminProfile, loginAdmin } from "../application/auth-service";
import { loginSchema } from "../domain/validators";
import { requireAdminAuth } from "../middleware/admin-auth";
import { sendBadRequest, sendNotFound } from "../shared/http";

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    try {
      const result = await loginAdmin(parsed.data);
      return reply.code(200).send(result);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        return reply.code(401).send({
          error: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      return reply.code(500).send({
        error: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error during login.",
      });
    }
  });

  app.get("/auth/me", { preHandler: [requireAdminAuth] }, async (req, reply) => {
    const userId = req.adminUser!.id;
    const profile = await getAdminProfile(userId);

    if (!profile) {
      return sendNotFound(reply, "Admin user not found.");
    }

    return profile;
  });
}
