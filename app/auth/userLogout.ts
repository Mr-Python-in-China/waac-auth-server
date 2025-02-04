"use server";

import { deleteUserSession } from "@/redis/userSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function userLogout() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return;
  deleteUserSession(session);
  (await cookies()).delete("session");
  redirect("/");
}
