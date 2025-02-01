"use server";

import logger from "@/logger";
import { createRegisterSession } from "@/redis/registerSession";

export default async function registerSession() {
  try {
    return await createRegisterSession();
  } catch (e) {
    logger.error("Unknown error in app/auth/register/registerSession.ts", e);
    return "UnknownError";
  }
}
