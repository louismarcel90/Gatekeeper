import { FastifyInstance, FastifyReply } from "fastify";
import { DomainEvent } from "../events/domain-event";
import {
  registerEventStreamClient,
  unregisterEventStreamClient,
} from "../events/domain-event-stream";

function writeSseEvent(reply: FastifyReply, event: DomainEvent): void {
  reply.raw.write(`event: ${event.name}\n`);
  reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
}

export async function registerDomainEventStreamRoutes(app: FastifyInstance): Promise<void> {
  app.get("/events/stream", async (req, reply) => {
    const clientId = crypto.randomUUID();

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    reply.raw.write(
      `data: ${JSON.stringify({
        type: "connected",
        client_id: clientId,
        timestamp: new Date().toISOString(),
      })}\n\n`,
    );

    registerEventStreamClient({
      id: clientId,
      send: (event) => writeSseEvent(reply, event),
    });

    req.raw.on("close", () => {
      unregisterEventStreamClient(clientId);
    });
  });
}
