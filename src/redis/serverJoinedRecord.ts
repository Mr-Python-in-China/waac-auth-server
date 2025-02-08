import redis from ".";

export async function createJoinServerRecord(
  username: string,
  serverId: string
) {
  await redis.set("serverJoinedRecord:" + username, serverId, {
    EX: 30,
  });
}

export async function getJoinServerRecord(username: string) {
  return await redis.get("serverJoinedRecord:" + username);
}
