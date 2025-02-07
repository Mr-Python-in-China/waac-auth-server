import auth from "@/utils/auth";
import { AppLayout } from "@/components/appLayout";
import Main from "./main";
import redirectToLogin from "@/utils/redirectToLogin";
import { listProfiles } from "./listProfiles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "角色列表 - WAAC auth",
};


export default async function ProfilePage() {
  const user = await auth();
  if (user === undefined) redirectToLogin();
  return (
    <AppLayout tab="角色">
      <Main initProfileList={await listProfiles()} />
    </AppLayout>
  );
}
