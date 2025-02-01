import { Link } from "@primer/react";
import { Metadata } from "next";
import LoginForm from "./loginForm";

export const metadata: Metadata = {
  title: "注册 - WAAC auth",
};

export default function LoginPage() {
  return (
    <div
      style={{
        width: "288px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>登录</h1>
      <div
        style={{
          padding: "var(--base-size-16)",
          backgroundColor: "var(--bgColor-muted)",
          border: "var(--borderWidth-thin) solid var(--borderColor-muted)",
          borderRadius: "var(--borderRadius-medium)",
        }}
      >
        <LoginForm />
      </div>
      <div
        style={{
          marginTop: "var(--base-size-16)",
          padding: "var(--base-size-16)",
          border: "var(--borderWidth-thin) solid var(--borderColor-default)",
          borderRadius: "var(--borderRadius-medium)",
          display: "flex",
          gap: "var(--stack-gap-condensed)",
        }}
      >
        <div
          style={{
            color: "var(--fgColor-muted)",
            textAlign: "center",
            width: "100%",
          }}
        >
          还没有账号？<Link href="/auth/register">注册</Link>
        </div>
      </div>
    </div>
  );
}
