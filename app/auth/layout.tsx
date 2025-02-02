import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "288px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}