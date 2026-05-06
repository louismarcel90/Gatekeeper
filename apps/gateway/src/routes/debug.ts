import type { FastifyInstance } from "fastify";

import { snapshotStore } from "../services/snapshot-store";

export async function registerDebugRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get("/_debug/snapshot", async () => {
    return {
      snapshot: snapshotStore.getSnapshot(),
    };
  });
}