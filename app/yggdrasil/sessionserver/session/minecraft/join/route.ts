import { getProfileSummaryWithOwnerId } from "@/database/profile";
import logger from "@/logger";
import { createJoinServerRecord } from "@/redis/serverJoinedRecord";
import { validateYggdrasilSession } from "@/redis/yggdrasilSession";
import { safeCallAsync } from "@/utils/safeCall";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  accessToken: z.string(),
  selectedProfile: z.string(),
  serverId: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  return (async () => {
    const user = await validateYggdrasilSession(data.accessToken);
    if (
      !user ||
      !("profileId" in user) ||
      data.selectedProfile !== user.profileId
    )
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid access token or profile.",
        },
        { status: 403 }
      );
    const profileSummary = await getProfileSummaryWithOwnerId(user.profileId);
    if (!profileSummary)
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid access token or profile.",
        },
        { status: 403 }
      );
    await createJoinServerRecord(profileSummary.name, data.serverId);
    return new NextResponse(null, { status: 204 });
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/sessionserver/session/minecraft/join/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
