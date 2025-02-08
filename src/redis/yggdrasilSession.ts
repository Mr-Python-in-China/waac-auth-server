import { randomBytes } from "crypto";
import redis from ".";

export async function createYggdrasilSession(uid: string, username: string) {
  const session = randomBytes(16).toString("hex");
  await redis.set("yggdrasilSession:" + session, uid + "," + username, {
    EX: 10 * 24 * 60 * 60, // 10 days
  });
  return session;
}

export async function setSelectedProfile(
  session: string,
  profile: { id: string; name: string }
) {
  const s = await redis.get("yggdrasilSession:" + session);
  if (s === null) return false;
  const [uid, username] = s.split(",");
  await redis.set(
    "yggdrasilSession:" + session,
    uid + "," + username + "," + profile.id + "," + profile.name,
    {
      EX: 10 * 24 * 60 * 60, // 10 days
    }
  );
  return true;
}

export async function validateYggdrasilSession(session: string): Promise<
  | {
      uid: string;
      username: string;
      profileId: string;
      profileName: string;
    }
  | {
      uid: string;
      username: string;
    }
  | undefined
> {
  const v = await redis.expire(
    "yggdrasilSession:" + session,
    10 * 24 * 60 * 60
  ); // 10 days
  const s = await redis.get("yggdrasilSession:" + session);
  if (!v || s === null) return undefined;
  const [uid, username, ...profileInfo] = s.split(",");
  if (profileInfo.length) {
    const [profileId, profileName] = profileInfo;
    return { uid, username, profileId: profileId, profileName: profileName };
  }
  return { uid, username };
}

export async function deleteYggdrasilSession(session: string) {
  await redis.del("yggdrasilSession:" + session);
}
