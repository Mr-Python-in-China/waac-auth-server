import { AppLayout } from "@/components/appLayout";
import { Metadata } from "next";
import Main from "./main";
import profileData from "./profileData";
import auth from "@/utils/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profileId: string }>;
}): Promise<Metadata> {
  const { profileId } = await params;
  const profile = await profileData(profileId);
  return {
    title: `${profile.name} - WAAC auth`,
  };
}

export default async function ProfileInfoPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const profile = await profileData(profileId);
  const uid = (await auth())?.uid;
  if (uid === undefined) redirect("/auth/login");
  if (uid !== profile.ownerId) redirect("/profile");
  return (
    <AppLayout tab="角色">
      <Main initialProfile={profile} />
    </AppLayout>
  );
}
