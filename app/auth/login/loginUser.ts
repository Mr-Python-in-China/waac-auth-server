"use server";

import { validateUserLogin } from "@/database/user";
import logger from "@/logger";
import { createUserSession } from "@/redis/userSession";
import { cookies } from "next/headers";

export default async function loginUser(username: string, password: string) {
  try {
    const res = await validateUserLogin(username, password);
    if (typeof res === "string") return res;
    const session = await createUserSession(res.id,res.name);
    const cookie = await cookies();
    cookie.set("session", session, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60, // 10 days
    });
  } catch (e) {
    logger.error("Unknown error in app/auth/login/loginUser.ts", e);
    return "UnknownError";
  }
}
