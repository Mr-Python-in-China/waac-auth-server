import { randomUnsignedUUID } from "@/utils/random";
import prisma from ".";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function listProfiles(uid: string) {
  return await prisma.profile.findMany({
    where: {
      ownerId: uid,
    },
    select: {
      id: true,
      name: true,
      model: true,
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

export async function createProfile(
  name: string,
  ownerId: string,
  defaultSkinId: Uint8Array
) {
  try {
    return (
      await prisma.profile.create({
        data: {
          id: randomUnsignedUUID(),
          name,
          skinId: defaultSkinId,
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

export async function getProfileOwner(id: string) {
  return (
    await prisma.profile.findUnique({
      where: {
        id,
      },
      select: {
        owner: { select: { id: true, name: true } },
      },
    })
  )?.owner;
}

export async function getProfileOwnerByName(name: string) {
  return (
    await prisma.profile.findUnique({
      where: {
        name,
      },
      select: {
        owner: { select: { id: true, name: true } },
      },
    })
  )?.owner;
}

export async function getProfile(id: string) {
  return await prisma.profile.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      model: true,
      skinId: true,
      capeId: true,
      createdAt: true,
    },
  });
}

export async function getProfileByName(name: string) {
  return await prisma.profile.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      model: true,
      skinId: true,
      capeId: true,
      createdAt: true,
    },
  });
}

export async function getProfileWithTexture(id: string) {
  return await prisma.profile.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      model: true,
      skin: true,
      cape: true,
      createdAt: true,
      ownerId: true,
    },
  });
}

export async function setProfileName(id: string, newName: string) {
  try {
    return await prisma.profile.update({
      where: { id },
      data: { name: newName },
      select: {
        id: true,
        name: true,
        model: true,
        skin: true,
        cape: true,
        createdAt: true,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      const target = e.meta?.target as string[] | undefined;
      if (target?.includes("name"))
        throw new Error("ProfileNameExists", { cause: e });
    }
    throw e;
  }
}
export async function setProfileModel(id: string, model: boolean) {
  return await prisma.profile.update({
    where: { id },
    data: { model },
    select: {
      id: true,
      name: true,
      model: true,
      skin: true,
      cape: true,
      createdAt: true,
    },
  });
}

export async function setProfileSkinTexture(id: string, texture: Uint8Array) {
  return await prisma.profile.update({
    where: { id },
    data: { skinId: texture },
    select: {
      id: true,
      name: true,
      model: true,
      skin: true,
      cape: true,
      createdAt: true,
    },
  });
}

export async function setProfileCapeTexture(id: string, texture: Uint8Array) {
  return await prisma.profile.update({
    where: { id },
    data: { capeId: texture },
    select: {
      id: true,
      name: true,
      model: true,
      skin: true,
      cape: true,
      createdAt: true,
    },
  });
}
export async function deleteProfileCapeTexture(id: string) {
  return await prisma.profile.update({
    where: { id },
    data: { capeId: null },
    select: {
      id: true,
      name: true,
      model: true,
      skin: true,
      cape: true,
      createdAt: true,
    },
  });
}

export async function deleteProfile(id: string) {
  await prisma.profile.delete({
    where: { id },
  });
}

export async function getProfileSummaryByName(name: string) {
  return await prisma.profile.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function listManyProfileSummaryByNames(names: string[]) {
  return await prisma.profile.findMany({
    where: {
      name: {
        in: names,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getProfileSummaryWithOwnerId(id: string) {
  return await prisma.profile.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });
}
