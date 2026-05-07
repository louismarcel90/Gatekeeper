import Redis from "ioredis";

import { env } from "../config/env";

export const runtimeRedis = new Redis(env.REDIS_URL, {
  lazyConnect: false,
  maxRetriesPerRequest: 3,
});