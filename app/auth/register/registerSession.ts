"use server";

import { createRegisterSession } from "@/redis/registerSession";

export default async function registerSession() {
  "use server";
  return await createRegisterSession();
}
