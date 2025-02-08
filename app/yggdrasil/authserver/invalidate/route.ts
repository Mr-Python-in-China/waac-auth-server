import logger from "@/logger";
import {
  deleteYggdrasilSession,
} from "@/redis/yggdrasilSession";
import { safeCallAsync } from "@/utils/safeCall";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  accessToken: z.string(),
  clientToken: z.string().optional(),
});
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  return (async () => {
    await deleteYggdrasilSession(data.accessToken);
    return new NextResponse(null, { status: 204 });
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/authserver/invalidate/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
