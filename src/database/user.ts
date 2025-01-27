import { randomBytes } from "crypto";
import prisma from ".";
import { saltPassowrd, sleep } from "@/utils/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export async function dbCreateUser(
  name: string,
  lguid: number,
  password: string,
  retry = 0
): Promise<{ id: number; username: string }> {
  const salt = randomBytes(16);
  const saltedPssword = saltPassowrd(password, salt);
  try {
    const res = await prisma.user.create({
      data: {
        id: await prisma.user.count(),
        name,
        lguid,
        password: saltedPssword,
        salt: salt,
      },
    });
    return {
      id: res.id,
      username: res.name,
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      const target = e.meta?.target as string[] | undefined;
      if (target?.includes("id")) {
        if (retry <= 3)
          return await sleep(200).then(() =>
            dbCreateUser(name, lguid, password, retry + 1)
          );
      } else if (target?.includes("name"))
        throw new Error("UsernameExists", { cause: e });
      else if (target?.includes("lguid"))
        throw new Error("LguidExists", { cause: e });
    }
    throw e;
  }
}
