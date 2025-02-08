import logger from "@/logger";
import { getJoinServerRecord } from "@/redis/serverJoinedRecord";
import { genProfileData } from "@/utils/genProfileData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const username = req.nextUrl.searchParams.get("username"),
    serverId = req.nextUrl.searchParams.get("serverId");
  if (!username || !serverId)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  return (async () => {
    const record = await getJoinServerRecord(username);
    if (record !== serverId) return new NextResponse(null, { status: 204 });
    const profile = await genProfileData({ name: username }, false);
    if (!profile) return new NextResponse(null, { status: 204 });
    else return NextResponse.json(profile);
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
