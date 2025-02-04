import { randomUnsignedUUID } from "@/utils/random";
import prisma from ".";
import { createSteveTexture } from "./texture";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function listProfiles(uid: string) {
  return await prisma.profile.findMany({
    where: {
      ownerId: uid,
    },
    select: {
      id: true,
      name: true,
      skin: true,
      cape: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
}

export async function listProfileSummary(uid: string) {
  return await prisma.profile.findMany({
    where: {
      ownerId: uid,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
}

export async function createProfile(name: string, ownerId: string) {
  const steveHash = await createSteveTexture();
  try {
    return (
      await prisma.profile.create({
        data: {
          id: randomUnsignedUUID(),
          name,
          skinId: steveHash,
          ownerId,
        },
        select: { id: true },
      })
    ).id;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      const target = e.meta?.target as string[] | undefined;
      if (target?.includes("name"))
        throw new Error("ProfileNameExists", { cause: e });
    }
    throw e;
  }
}

export async function getProfileOwner(name: string) {
  return (
    await prisma.profile.findUnique({
      where: {
        name,
      },
      select: {
        owner: true,
      },
    })
  )?.owner.name;
}
