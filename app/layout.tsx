import { ThemeProvider, BaseStyles } from "@primer/react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-cn">
      <body>
        <ThemeProvider>
          <BaseStyles>{children}</BaseStyles>
        </ThemeProvider>
      </body>
    </html>
  );
}
