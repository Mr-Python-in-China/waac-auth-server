import { getProfile } from "@/database/profile";
import logger from "@/logger";
import {
  createYggdrasilSession,
  deleteYggdrasilSession,
  setSelectedProfile,
  validateYggdrasilSession,
} from "@/redis/yggdrasilSession";
import { safeCallAsync } from "@/utils/safeCall";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  accessToken: z.string(),
  clientToken: z.string().optional(),
  requestUser: z.boolean().default(false),
  selectedProfile: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  return (async () => {
    const info = await validateYggdrasilSession(data.accessToken);
    if (!info)
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid token.",
        },
        { status: 403 }
      );
    deleteYggdrasilSession(data.accessToken);
    const newSession = await createYggdrasilSession(info.uid, info.username);
    let selectedProfile: { id: string; name: string } | undefined = undefined;
    if ("profileId" in info)
      selectedProfile = {
        id: info.profileId,
        name: info.profileName,
      };
    if (data.selectedProfile) {
      const newProfile = await getProfile(data.selectedProfile.id);
      if (
        newProfile &&
        newProfile.name === data.selectedProfile.name &&
        newProfile.ownerId === info.uid
      )
        selectedProfile = data.selectedProfile;
    }
    if (selectedProfile) await setSelectedProfile(newSession, selectedProfile);
    return NextResponse.json({
      accessToken: newSession,
      clientToken: data.clientToken,
      selectedProfile,
      user: data.requestUser
        ? {
            username: info.username,
            id: info.uid,
            properties: [],
          }
        : undefined,
    });
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/authserver/refresh/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
