import { randomBytes } from "crypto";
import redis from ".";

export async function createUserSession(uid: string, username: string) {
  const session = randomBytes(24).toString("base64");
  await redis.set("userSession:" + session, uid + "," + username, {
    EX: 10 * 24 * 60 * 60, // 10 days
  });
  return session;
}

export async function validateUserSession(session: string) {
  const v = await redis.expire("userSession:" + session, 10 * 24 * 60 * 60); // 10 days
  const s = await redis.get("userSession:" + session);
  if (!v || s === null) return undefined;
  const [uid, username] = s.split(",");
  return { uid, username };
}

export async function deleteUserSession(session: string) {
  await redis.del("userSession:" + session);
}
