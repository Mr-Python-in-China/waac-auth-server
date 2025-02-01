import { randomBytes } from "crypto";
import redis from ".";

export async function createUserSession(uid: number) {
  const session = randomBytes(24).toString("base64");
  await redis.set("userSession:" + session, uid.toString(), {
    EX: 10 * 24 * 60 * 60, // 10 days
  });
  return session;
}

export async function validateUserSession(session: string) {
  const s = await redis.get("userSession:" + session);
  if (s === null) return undefined;
  return parseInt(s);
}
