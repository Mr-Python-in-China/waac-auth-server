import redis from ".";

export async function incrementUserLoginFailedCount(name: string) {
  name = name.toLowerCase();
  const c = await redis.incrBy("userLoginFailedCount:" + name, 1);
  if (c === 5) {
    redis.set("userLoginFailedCount:" + name, "banned");
    redis.expire("userLoginFailedCount:" + name, 5 * 60);
  } else redis.expire("userLoginFailedCount:" + name, 1 * 60 * 60);
}
export async function checkUserLoginBannedState(name: string) {
  name = name.toLowerCase();
  return (await redis.get("userLoginFailedCount:" + name)) === "banned";
}
export async function resetUserLoginFailedCount(name: string) {
  name = name.toLowerCase();
  await redis.del("userLoginFailedCount:" + name);
}
