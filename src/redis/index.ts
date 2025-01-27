import logger from "@/logger";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  logger.error("Redis error", err);
  process.exit(1);
});

redis.connect();

export default redis;
