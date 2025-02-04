import { randomBytes } from "crypto";
import redis from ".";

export async function createYggdrasilSession(uid: string, username: string) {
  const session = randomBytes(16).toString("hex");
  await redis.set("yggdrasilSession:" + session, uid + "," + username, {
    EX: 10 * 24 * 60 * 60, // 10 days
  });
  return session;
}

export async function validateYggdrasilSession(session: string) {
  const v = await redis.expire(
    "yggdrasilSession:" + session,
    10 * 24 * 60 * 60
  ); // 10 days
  const s = await redis.get("yggdrasilSession:" + session);
  if (!v || s === null) return undefined;
  const [uid, username] = s.split(",");
  return { uid, username };
}

export async function deleteYggdrasilSession(session: string) {
  await redis.del("yggdrasilSession:" + session);
}
