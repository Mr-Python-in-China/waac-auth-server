"use server";

import prisma from "@/database";

export async function checkUserExistsByUsername(username: string) {
  return !!(await prisma.user.findUnique({
    where: { name: username },
    select: { id: true },
  }));
}

export async function checkUserExistsByLguid(lguid: number) {
  return !!(await prisma.user.findUnique({
    where: { lguid },
    select: { id: true },
  }));
}
