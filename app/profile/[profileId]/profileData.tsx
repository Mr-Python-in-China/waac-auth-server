"use server";

import { getProfileWithTexture } from "@/database/profile";
import { notFound } from "next/navigation";
import { cache } from "react";

const profileData = cache(async (id: string) => {
  const profile = await getProfileWithTexture(id);
  if (!profile) notFound();
  return {
    ...profile,
    model: profile.model ? "slim" : "default",
  } as const;
});
export default profileData;
