import { validateUserSession } from "@/redis/userSession";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

const auth = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  if (!session) return undefined;
  return await validateUserSession(session);
});
export default auth;
