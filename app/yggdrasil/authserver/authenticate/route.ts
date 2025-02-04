import { listProfileSummary } from "@/database/profile";
import { validateUserLogin } from "@/database/user";
import { createYggdrasilSession } from "@/redis/yggdrasilSession";
import { safeCallAsync } from "@/utils/safeCall";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  username: z.string(),
  password: z.string(),
  requestUser: z.boolean(),
  clientToken: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse<unknown>> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  return (async () => {
    const res = await validateUserLogin(data.username, data.password);
    if (typeof res === "string") {
      if (res === "UserNotFound" || res === "PasswordIncorrect")
        return NextResponse.json(
          {
            error: "ForbiddenOperationException",
            errorMessage: "Invalid credentials. Invalid username or password.",
          },
          { status: 403 }
        );
      res satisfies never;
    }
    const profiles = await listProfileSummary(res.id);
    return NextResponse.json({
      accessToken: await createYggdrasilSession(res.id, res.name),
      clientToken: data.clientToken ?? randomBytes(16).toString("hex"),
      user: data.requestUser
        ? {
            username: res.name,
            id: res.id,
            properties: [],
          }
        : undefined,
      availableProfiles: profiles,
      selectedProfile: profiles.length === 1 ? profiles[0] : undefined,
    });
  })().catch((e) => {
    console.error(
      "Unknown error in app/yggdrasil/authserver/authenticate/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
