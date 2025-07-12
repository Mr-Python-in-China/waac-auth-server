import { getProfileOwnerByName, listProfileSummary } from "@/database/profile";
import { validateUserLogin } from "@/database/user";
import logger from "@/logger";
import {
  incrementUserLoginFailedCount,
  checkUserLoginBannedState,
  resetUserLoginFailedCount,
} from "@/redis/userLoginFailedCount";
import {
  createYggdrasilSession,
  setSelectedProfile,
} from "@/redis/yggdrasilSession";
import { randomUnsignedUUID } from "@/utils/random";
import { safeCallAsync } from "@/utils/safeCall";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  username: z.string(),
  password: z.string(),
  requestUser: z.boolean().optional(),
  clientToken: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse<unknown>> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  if (data.requestUser === undefined) data.requestUser = false;
  return (async () => {
    let username: string;
    let selectedProfileName: string | undefined;
    if (data.username[0] === "%") {
      selectedProfileName = data.username.slice(1).toLowerCase();
      const owner = await getProfileOwnerByName(selectedProfileName);
      if (owner === undefined)
        return NextResponse.json(
          {
            error: "ForbiddenOperationException",
            errorMessage:
              "Invalid credentials. Invalid username or password.",
          },
          { status: 403 }
        );
      username = owner.name;
    } else username = data.username;
    if (await checkUserLoginBannedState(username))
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid credentials.",
        },
        { status: 403 }
      );
    const res = await validateUserLogin(username, data.password);
    if (typeof res === "string") {
      if (res === "PasswordIncorrect") await incrementUserLoginFailedCount(username);
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
    await resetUserLoginFailedCount(username);
    const profiles = await listProfileSummary(res.id);
    if (data.clientToken === undefined) data.clientToken = randomUnsignedUUID();
    const accessToken = await createYggdrasilSession(
      res.id,
      res.name,
      data.clientToken
    );
    const selectedProfile = selectedProfileName
      ? profiles.find((x) => x.name.toLowerCase() === selectedProfileName)
      : profiles.length === 1
        ? profiles[0]
        : undefined;
    if (selectedProfile) setSelectedProfile(accessToken, selectedProfile);
    return NextResponse.json({
      accessToken,
      clientToken: data.clientToken,
      user: data.requestUser
        ? {
            id: res.id,
            properties: [],
          }
        : undefined,
      availableProfiles: profiles,
      selectedProfile,
    });
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/authserver/authenticate/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
