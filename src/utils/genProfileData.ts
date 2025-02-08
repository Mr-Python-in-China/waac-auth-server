import { BASE_URL } from "@/constants";
import { getProfile, getProfileByName } from "@/database/profile";
import { signString } from "@/signatureKey";
import { toHex } from "./uint8ArrayUtils";

export async function genProfileData(
  profile: { id: string } | { name: string },
  unsigned = true
) {
  const data = await ("id" in profile
    ? getProfile(profile.id)
    : getProfileByName(profile.name));
  if (!data) return undefined;
  const textureProperty = {
    timestamp: new Date().getTime(),
    profileId: data.id,
    profileName: data.name,
    textures: {
      SKIN: {
        url: BASE_URL + "/textures/" + toHex(data.skinId),
        metadata: {
          model: data.model ? "slim" : "default",
        },
      },
      CAPE: data.capeId
        ? {
            url: BASE_URL + "/textures/" + toHex(data.capeId),
          }
        : undefined,
    },
  };
  const texturePropertyBase64 = btoa(JSON.stringify(textureProperty));
  return {
    id: data.id,
    name: data.name,
    properties: [
      {
        name: "textures",
        value: texturePropertyBase64,
        signature:
          unsigned === false ? signString(texturePropertyBase64) : undefined,
      },
    ],
  } as const;
}
