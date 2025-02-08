import { AppLayout } from "@/components/appLayout";
import YggdrasilDragableLink from "@/components/yggdrasilDragableLink";
import { Metadata } from "next";
import { BASE_URL } from "@/constants";

export const metadata: Metadata = {
  title: "主页 - WAAC auth",
};

export default async function RootPage() {
  return (
    <AppLayout tab="主页">
      <div
        style={{
          paddingLeft: "var(--base-size-16)",
          paddingRight: "var(--base-size-16)",
          paddingTop: "var(--base-size-16)",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1280px",
        }}
      >
        <h1>WAAC Minecraft Server</h1>
        <YggdrasilDragableLink baseUrl={BASE_URL} />
      </div>
    </AppLayout>
  );
}
