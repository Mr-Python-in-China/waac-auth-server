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
    const info = await validateYggdrasilSession(
      data.accessToken,
      data.clientToken
    );
    if (!info)
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid token.",
        },
        { status: 403 }
      );
    let selectedProfile: { id: string; name: string } | undefined = undefined;
    if ("profileId" in info)
      selectedProfile = {
        id: info.profileId,
        name: info.profileName,
      };
    if (data.selectedProfile) {
      if ("profileId" in info)
        return NextResponse.json(
          {
            error: "IllegalArgumentException",
            errorMessage:
              "You cannot change the selected profile when you already have one.",
          },
          { status: 400 }
        );
      const newProfile = await getProfile(data.selectedProfile.id);
      if (!newProfile || newProfile.name !== data.selectedProfile.name)
        return NextResponse.json(
          {
            error: "IllegalArgumentException",
            errorMessage: "Invalid profile.",
          },
          { status: 400 }
        );
      if (newProfile.ownerId !== info.uid)
        return NextResponse.json(
          {
            error: "ForbiddenOperationException",
            errorMessage: "You do not own this profile.",
          },
          { status: 403 }
        );
      selectedProfile = data.selectedProfile;
    }
    await deleteYggdrasilSession(data.accessToken);
    const newSession = await createYggdrasilSession(
      info.uid,
      info.username,
      info.clientToken
    );
    if (selectedProfile) await setSelectedProfile(newSession, selectedProfile);
    return NextResponse.json({
      accessToken: newSession,
      clientToken: info.clientToken,
      selectedProfile,
      user: data.requestUser
        ? {
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
