import { FastifyInstance } from "fastify";
import { snapshotStore } from "../services/snapshot-store";

export async function registerDebugRoutes(app: FastifyInstance) {
  app.get("/_debug/snapshot", async () => {
    return {
      snapshot: snapshotStore.getSnapshot(),
    };
  });
}