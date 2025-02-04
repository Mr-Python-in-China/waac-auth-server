import { getTexture } from "@/database/texture";
import logger from "@/logger";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  revalidate: 2592000, // 30 days
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ textureHash: string }> }
) {
  if ((await params).textureHash.length !== 64)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  try {
    const texture = await getTexture(
      Uint8Array.from(Buffer.from((await params).textureHash, "hex"))
    );
    if (texture === undefined) {
      return NextResponse.json(
        {
          error: "Not Found",
        },
        { status: 404 }
      );
    }
    return new NextResponse(texture, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (e) {
    logger.error("Unknown error in app/textures/[textureHash]/route.ts", e);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
