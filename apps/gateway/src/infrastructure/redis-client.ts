import { createClient, type RedisClientType } from "redis";
import { gatewayConfig } from "../config/env";

export const redisClient: RedisClientType = createClient({
  url: gatewayConfig.redisUrl,
});

let hasConnected = false;
let listenersRegistered = false;

export async function connectRedis(): Promise<void> {
  if (hasConnected) return;

  if (!listenersRegistered) {
    redisClient.on("error", (error) => {
      console.error("[REDIS ERROR]", error);
    });

    redisClient.on("reconnecting", () => {
      console.warn("[REDIS] reconnecting...");
    });

    redisClient.on("ready", () => {
      console.log("[REDIS] ready");
    });

    listenersRegistered = true;
  }

  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      await redisClient.connect();
      hasConnected = true;
      console.log("[REDIS] connected");
      return;
    } catch (err) {
      retries++;
      console.error(`[REDIS] connection failed (${retries}/${maxRetries})`, err);
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
    }
  }

  throw new Error("Failed to connect to Redis after retries");
}
