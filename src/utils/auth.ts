import { validateUserSession } from "@/redis/userSession";
import { cookies } from "next/headers";
import "server-only";

export default async function auth() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return undefined;
  return await validateUserSession(session);
}
