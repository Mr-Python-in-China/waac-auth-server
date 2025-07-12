import { listManyProfileSummaryByNames } from "@/database/profile";
import logger from "@/logger";
import { safeCallAsync } from "@/utils/safeCall";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.array(z.string());

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  if (data.length > 10)
    return NextResponse.json(
      {
        error: "CONSTRAINT_VIOLATION",
        errorMessage: "size must be between 1 and 10",
      },
      { status: 400 }
    );
  if (data.some((name) => name === ""))
    return NextResponse.json(
      {
        error: "CONSTRAINT_VIOLATION",
        errorMessage: "Invalid profile name",
      },
      { status: 400 }
    );
  return (async () => {
    return NextResponse.json(await listManyProfileSummaryByNames(data));
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/api/profiles/minecraft/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
