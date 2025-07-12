import { randomBytes } from "crypto";
import redis from ".";

export async function createYggdrasilSession(
  uid: string,
  username: string,
  clientToken: string
) {
  const session = randomBytes(16).toString("hex");
  await redis.set(
    "yggdrasilSession:" + session,
    uid + "," + username + "," + clientToken,
    {
      EX: 10 * 24 * 60 * 60, // 10 days
    }
  );
  return session;
}

export async function setSelectedProfile(
  session: string,
  profile: { id: string; name: string }
) {
  const s = await redis.get("yggdrasilSession:" + session);
  if (s === null) return false;
  const [uid, username, clientToken] = s.split(",");
  await redis.set(
    "yggdrasilSession:" + session,
    uid +
      "," +
      username +
      "," +
      clientToken +
      "," +
      profile.id +
      "," +
      profile.name,
    {
      EX: 10 * 24 * 60 * 60, // 10 days
    }
  );
  return true;
}

export async function validateYggdrasilSession(
  session: string,
  clientToken?: string
): Promise<
  | ({
      uid: string;
      username: string;
      clientToken: string;
    } & (
      | { profileId: string; profileName: string }
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      | {}
    ))
  | undefined
> {
  const v = await redis.expire(
    "yggdrasilSession:" + session,
    10 * 24 * 60 * 60
  ); // 10 days
  const s = await redis.get("yggdrasilSession:" + session);
  if (!v || s === null) return undefined;
  const [uid, username, dataClientToken, ...profileInfo] = s.split(",");
  if (clientToken && dataClientToken !== clientToken) return undefined;
  if (profileInfo.length) {
    const [profileId, profileName] = profileInfo;
    return {
      uid,
      username,
      clientToken: dataClientToken,
      profileId: profileId,
      profileName: profileName,
    };
  }
  return { uid, username, clientToken: dataClientToken };
}

export async function deleteYggdrasilSession(session: string) {
  return await redis.del("yggdrasilSession:" + session);
}

export async function deleteAllYggdrasilSessionsByUserId(uid: string) {
  const sessions = await redis.keys("yggdrasilSession:*");
  let deletedCount = 0;

  for (const sessionKey of sessions) {
    const sessionData = await redis.get(sessionKey);
    if (sessionData) {
      const [sessionUid] = sessionData.split(",");
      if (sessionUid === uid) {
        await redis.del(sessionKey);
        deletedCount++;
      }
    }
  }

  return deletedCount;
}
