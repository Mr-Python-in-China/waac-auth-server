import { AppLayout } from "@/components/appLayout";
import { Metadata } from "next";
import Main from "./main";
import profileData from "./profileData";

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

  return (
    <AppLayout tab="角色">
      <Main initialProfile={profile} />
    </AppLayout>
  );
}
