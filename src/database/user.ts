import { randomBytes } from "crypto";
import prisma from ".";
import { saltPassowrd } from "@/utils/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUnsignedUUID } from "@/utils/random";

export async function dbCreateUser(
  name: string,
  lguid: number,
  password: string
) {
  const salt = randomBytes(16);
  const saltedPssword = saltPassowrd(password, salt);
  try {
    const res = await prisma.user.create({
      data: {
        id: randomUnsignedUUID(),
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
      if (target?.includes("name"))
        throw new Error("UsernameExists", { cause: e });
      else if (target?.includes("lguid"))
        throw new Error("LguidExists", { cause: e });
    }
    throw e;
  }
}

export async function validateUserLogin(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { name: username },
    select: { id: true, name: true, salt: true, password: true },
  });
  if (!user) return "UserNotFound";
  const saltedPassword = saltPassowrd(password, user.salt);
  if (Buffer.compare(saltedPassword, user.password) === 0)
    return { id: user.id, name: user.name };
  return "PasswordIncorrect";
}
