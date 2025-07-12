import logger from "@/logger";
import { validateUserLogin } from "@/database/user";
import { deleteAllYggdrasilSessionsByUserId } from "@/redis/yggdrasilSession";
import { safeCallAsync } from "@/utils/safeCall";
import { 
  incrementUserLoginFailedCount, 
  checkUserLoginBannedState, 
  resetUserLoginFailedCount 
} from "@/redis/userLoginFailedCount";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse<unknown>> {
  const data = await safeCallAsync(async () =>
    RequestSchema.parse(await req.json())
  );
  if ("$error" in data)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  return (async () => {
    // 检查用户是否被禁止登录
    if (await checkUserLoginBannedState(data.username))
      return NextResponse.json(
        {
          error: "ForbiddenOperationException",
          errorMessage: "Invalid credentials.",
        },
        { status: 403 }
      );

    // 验证用户名和密码
    const res = await validateUserLogin(data.username, data.password);
    if (typeof res === "string") {
      if (res === "PasswordIncorrect") await incrementUserLoginFailedCount(data.username);
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

    // 验证成功，重置失败计数
    await resetUserLoginFailedCount(data.username);

    // 吊销用户的所有令牌
    await deleteAllYggdrasilSessionsByUserId(res.id);

    return new NextResponse(null, { status: 204 });
  })().catch((e) => {
    logger.error(
      "Unknown error in app/yggdrasil/authserver/signout/route.ts POST",
      e
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  });
}
