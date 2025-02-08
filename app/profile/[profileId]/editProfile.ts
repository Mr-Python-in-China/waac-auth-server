"use server";

import logger from "@/logger";
import {
  setProfileName as setProfileNameDB,
  setProfileModel as setProfileModelDB,
  setProfileSkinTexture as setProfileSkinTextureDB,
  setProfileCapeTexture as setProfileCapeTextureDB,
  deleteProfileCapeTexture as deleteProfileCapeTextureDB,
  deleteProfile as deleteProfileDB,
  getProfileOwner,
} from "@/database/profile";
import { createTexture as createTextureDB } from "@/database/texture";
import { toProfileInterface } from "../profileClass";
import { processCapeTexture, processSkinTexture } from "@/utils/processTexture";
import { redirect, RedirectType } from "next/navigation";
import auth from "@/utils/auth";

export async function setProfileName(id: string, newName: string) {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    return toProfileInterface(await setProfileNameDB(id, newName));
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "ProfileNameExists") return e.message;
    }
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function setProfileName",
      e
    );
    return "UnknownError";
  }
}
export async function setProfileModel(id: string, model: "default" | "slim") {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    return toProfileInterface(await setProfileModelDB(id, model === "slim"));
  } catch (e) {
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function setProfileModel",
      e
    );
    return "UnknownError";
  }
}
export async function setProfileSkinTexture(id: string, texture: Uint8Array) {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    const img = await processSkinTexture(texture);
    if (typeof img === "string") return img;
    const textureId = await createTextureDB(img);
    return toProfileInterface(await setProfileSkinTextureDB(id, textureId));
  } catch (e) {
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function setProfileSkinTexture",
      e
    );
    return "UnknownError";
  }
}
export async function setProfileCapeTexture(id: string, texture: Uint8Array) {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    const img = await processCapeTexture(texture);
    if (typeof img === "string") return img;
    const textureId = await createTextureDB(img);
    return toProfileInterface(await setProfileCapeTextureDB(id, textureId));
  } catch (e) {
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function setProfileCapeTexture",
      e
    );
    return "UnknownError";
  }
}
export async function deleteProfileCapeTexture(id: string) {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    return toProfileInterface(await deleteProfileCapeTextureDB(id));
  } catch (e) {
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function deleteProfileCapeTexture",
      e
    );
    return "UnknownError";
  }
}
export async function deleteProfile(id: string) {
  try {
    if (((await getProfileOwner(id))?.id ?? "Who?") !== (await auth())?.uid)
      return "NoAccess";
    await deleteProfileDB(id);
  } catch (e) {
    logger.error(
      "Error in app/profile/[profileId]/editProfile.ts function deleteProfileCapeTexture",
      e
    );
    return "UnknownError" as const;
  }
  redirect("/profile", RedirectType.replace);
}
