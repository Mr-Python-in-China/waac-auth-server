"use server";

import prisma from "@/database";

export async function checkProfileExits(name: string) {
  return await prisma.profile.findUnique({
    where: { name },
    select: { id: true },
  });
}
