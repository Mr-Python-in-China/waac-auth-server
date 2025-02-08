import logger from "@/logger";
import { genProfileData } from "@/utils/genProfileData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
  const unsignedParam = req.nextUrl.searchParams.get("unsigned") ?? "true";
  if (unsignedParam !== "true" && unsignedParam !== "false")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  const { uuid } = await params;
  return (async () => {
    const data = genProfileData({ id: uuid }, unsignedParam === "true");
    if (!data) return new NextResponse(null, { status: 204 });
    else return NextResponse.json(data);
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/sessionserver/session/minecraft/profile/[uuid]/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
