import { hash } from "crypto";
import prisma from ".";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import SteveSkinTexture from "@/utils/defaultSkinTexture";

export async function getTexture(hash: Uint8Array) {
  return (
    await prisma.texture.findUnique({
      where: {
        hash,
      },
      select: { data: true },
    })
  )?.data;
}

export async function createTexture(texture: Uint8Array) {
  const textureHash = Uint8Array.from(hash("SHA-256", texture, "buffer"));
  try {
    return (
      await prisma.texture.create({
        data: {
          hash: textureHash,
          data: texture,
        },
        select: { hash: true },
      })
    ).hash;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002")
      return textureHash;
    throw e;
  }
}

export async function createSteveTexture() {
  return await createTexture(SteveSkinTexture);
}
