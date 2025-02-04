import auth from "@/utils/auth";
import { AppLayout } from "@/components/appLayout";
import Main from "./main";
import redirectToLogin from "@/utils/redirectToLogin";
import { listProfiles } from "./listProfiles";

export default async function ProfilePage() {
  const user = await auth();
  if (user === undefined) redirectToLogin();
  return (
    <AppLayout tab="角色">
      <Main initProfileList={await listProfiles()} />
    </AppLayout>
  );
}
