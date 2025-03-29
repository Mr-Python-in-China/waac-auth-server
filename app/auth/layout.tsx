import { ReactNode } from "react";
import { AppLayout } from "@/components/appLayout";

export default function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <AppLayout>
      <div
        style={{
          width: "288px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </AppLayout>
  );
}
