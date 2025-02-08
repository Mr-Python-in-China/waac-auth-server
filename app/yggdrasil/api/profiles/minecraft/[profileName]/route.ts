import { getProfileSummaryByName } from "@/database/profile";
import logger from "@/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ profileName: string }> }
): Promise<NextResponse> {
  const { profileName } = await params;
  return (async () => {
    const res = await getProfileSummaryByName(profileName);
    if (!res) return new NextResponse(null, { status: 204 });
    else return NextResponse.json(res);
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/api/profiles/minecraft/[profileName]/route.ts GET",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
