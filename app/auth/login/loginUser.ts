"use server";

import { validateUserLogin } from "@/database/user";
import logger from "@/logger";
import {
  addUserLoginFailedCount,
  checkUserLoginBannedState,
  resetUserLoginFailedCount,
} from "@/redis/userLoginFailedCount";
import { createUserSession } from "@/redis/userSession";
import { cookies } from "next/headers";

export default async function loginUser(username: string, password: string) {
  try {
    if (typeof username !== "string" || typeof password !== "string")
      throw new TypeError("InvalidParams");
    if (await checkUserLoginBannedState(username)) return "FailedTooManyTimes";
    const res = await validateUserLogin(username, password);
    if (typeof res === "string") {
      if (res === "PasswordIncorrect") await addUserLoginFailedCount(username);
      return res;
    }
    await resetUserLoginFailedCount(username);
    const session = await createUserSession(res.id, res.name);
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
