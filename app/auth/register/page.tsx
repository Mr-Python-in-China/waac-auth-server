import { Metadata } from "next";
import RegisterForm from "./registerForm";
import { Link } from "@primer/react";
import auth from "@/utils/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "注册 - WAAC auth",
};

export default async function registerPage() {
  if ((await auth()) !== undefined) redirect("/");
  return (
    <div
      style={{
        width: "288px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>注册</h1>
      <p style={{ color: "var(--fgColor-muted)" }}>
        请准备一个已经<b>通过实名认证的洛谷账户</b>，将以下内容填写至
        <b>个人签名</b>处，然后接着完善以下信息。该 session 10 分钟内有效。
      </p>
      <div
        style={{
          padding: "var(--base-size-16)",
          backgroundColor: "var(--bgColor-muted)",
          border: "var(--borderWidth-thin) solid var(--borderColor-muted)",
          borderRadius: "var(--borderRadius-medium)",
        }}
      >
        <RegisterForm />
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
          已有账号？<Link href="/auth/login">登录</Link>
        </div>
      </div>
    </div>
  );
}
