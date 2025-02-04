import "@primer/primitives/dist/css/functional/themes/light.css";
import "@primer/primitives/dist/css/functional/themes/dark.css";
import "@primer/primitives/dist/css/base/size/size.css";
import "@primer/primitives/dist/css/base/typography/typography.css";
import "@primer/primitives/dist/css/functional/size/border.css";
import "@primer/primitives/dist/css/functional/size/breakpoints.css";
import "@primer/primitives/dist/css/functional/size/size-coarse.css";
import "@primer/primitives/dist/css/functional/size/size-fine.css";
import "@primer/primitives/dist/css/functional/size/size.css";
import "@primer/primitives/dist/css/functional/size/viewport.css";
import "@primer/primitives/dist/css/functional/typography/typography.css";
import { AuthContextProvider } from "../src/components/authContext";
import auth from "@/utils/auth";
import { ThemeProvider, BaseStyles } from "@primer/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-cn">
      <body>
        <div id="app" style={{ fontSize: "var(--text-body-size-medium)" }}>
          <AuthContextProvider user={await auth()}>
            <ThemeProvider>
              <BaseStyles>{children}</BaseStyles>
            </ThemeProvider>
          </AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
