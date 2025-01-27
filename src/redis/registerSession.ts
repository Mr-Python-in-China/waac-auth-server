import { randomBytes } from "crypto";
import redis from ".";

export async function createRegisterSession() {
  const session = "waac_" + randomBytes(12).toString("base64");
  await redis.set("registerSession:" + session, "", {
    EX: 10 * 60, // 10 min
  });
  return session;
}

export async function validateRegisterSession(session: string) {
  return Boolean(await redis.exists("registerSession:" + session));
}
