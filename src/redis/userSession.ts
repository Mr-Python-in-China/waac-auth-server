import { randomBytes } from "crypto";
import redis from ".";

export async function createUserSession(uid: string) {
  const session = randomBytes(24).toString("base64");
  await redis.set("userSession:" + session, uid, {
    EX: 10 * 24 * 60 * 60, // 10 days
  });
  return session;
}

export async function validateUserSession(session: string) {
  const v = await redis.expire("userSession:" + session, 10 * 24 * 60 * 60); // 10 days
  const s = await redis.get("userSession:" + session);
  if (!v || s === null) return undefined;
  return s;
}
