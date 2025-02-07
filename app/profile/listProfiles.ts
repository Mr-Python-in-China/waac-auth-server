"use server";

import auth from "@/utils/auth";
import { listProfiles as listProfilesDB } from "@/database/profile";
import logger from "@/logger";
import redirectToLogin from "@/utils/redirectToLogin";
import Profile, { toProfileInterface } from "./profileClass";

export async function listProfiles() {
  try {
    const user = await auth();
    if (user === undefined) redirectToLogin();
    return (await listProfilesDB(user.uid)).map((x) =>
      toProfileInterface(x)
    ) satisfies Profile[];
  } catch (e) {
    logger.error("Unknown error in app/profile/listProfiles.tsx", e);
    return "UnknownError";
  }
}
