"use server";

import { dbCreateUser } from "@/database/user";
import logger from "@/logger";
import { validateRegisterSession } from "@/redis/registerSession";
import axios from "axios";

export default async function registerUser(
  session: unknown,
  username: unknown,
  lguid: unknown,
  password: unknown
) {
  if (
    typeof session !== "string" ||
    typeof username !== "string" ||
    typeof lguid !== "number" ||
    typeof password !== "string"
  )
    throw new TypeError("InvalidParams");
  try {
    if (!validateRegisterSession(session)) return "UnknownSession";
    const fetchRes = (
      await axios.get(`https://www.luogu.com/user/${lguid}?_contentOnly`, {
        timeout: 3000,
        headers: {
          "User-Agent": "WAAC Auth Server",
        },
      })
    ).data;
    if (fetchRes.code !== 200) return "LuoguUserNotFound";
    if (fetchRes.currentData.user.slogan !== session) return "SessionMismatch";
    return await dbCreateUser(username, lguid, password);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "UsernameExists" || e.message === "LguidExists")
        return e.message;
    }
    logger.error("Unknown error in app/auth/register/registerUser.ts", e);
    return "UnknownError";
  }
}
