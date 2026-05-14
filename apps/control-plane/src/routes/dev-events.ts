import { FastifyInstance } from "fastify";
import { publishDomainEvent } from "../events/domain-event-bus";

export async function registerDevEventRoutes(app: FastifyInstance): Promise<void> {
  app.post("/_dev/events/test", async () => {
    const event = await publishDomainEvent({
      name: "route.updated",
      payload: {
        resource_id: "route_dev_test",
        resource_type: "managed_route",
        action: "dev_test",
        metadata: {
          source: "manual_test",
        },
      },
    });

    return {
      ok: true,
      event,
    };
  });
}
