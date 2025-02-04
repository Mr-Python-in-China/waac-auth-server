"use server";

import auth from "@/utils/auth";
import redirectToLogin from "@/utils/redirectToLogin";
import { createProfile as createProfileDB } from "@/database/profile";
import logger from "@/logger";

export default async function createProfile(name: string) {
  const user = await auth();
  if (user === undefined) redirectToLogin();
  try {
    return { id: await createProfileDB(name, user.uid) };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "ProfileNameExists") return e.message;
    }
    logger.error("Unknown error in app/profile/createProfile.ts", e);
    return "UnknownError";
  }
}
