"use server";

import auth from "@/utils/auth";
import redirectToLogin from "@/utils/redirectToLogin";
import { createProfile as createProfileDB } from "@/database/profile";
import logger from "@/logger";
import { createSteveTexture as createSteveTextureDB } from "@/database/texture";

export default async function createProfile(name: string) {
  try {
    const user = await auth();
    if (user === undefined) redirectToLogin();
    return {
      id: await createSteveTextureDB().then((textureId) =>
        createProfileDB(name, user.uid, textureId)
      ),
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "ProfileNameExists") return e.message;
    }
    logger.error("Unknown error in app/profile/createProfile.ts", e);
    return "UnknownError";
  }
}
