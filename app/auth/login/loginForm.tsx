"use client";

import { Button, FormControl, TextInput } from "@primer/react";
import { useActionState, useState } from "react";
import loginUser from "./loginUser";
import { Banner } from "@primer/react/experimental";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [inputUsername, setInputUsername] = useState<string>(
    new URLSearchParams(window.location.search).get("username") ?? ""
  );
  const [inputPassword, setInputPassword] = useState<string>("");
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [, submitAction, isPending] = useActionState(async () => {
    setBannerMessage(undefined);
    try {
      const res = await loginUser(inputUsername, inputPassword);
      if (res === "PasswordIncorrect") setBannerMessage("密码不正确。");
      else if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "UserNotFound") setBannerMessage("该用户不存在。");
      else router.push("/");
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error(e);
    }
  }, undefined);
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-size-8)",
      }}
      action={submitAction}
    >
      <FormControl required>
        <FormControl.Label>用户名</FormControl.Label>
        <TextInput
          name="username"
          block
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
        />
      </FormControl>
      <FormControl required>
        <FormControl.Label>密码</FormControl.Label>
        <TextInput
          name="password"
          block
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </FormControl>
      <Button type="submit" disabled={isPending}>
        登录
      </Button>
      {bannerMessage && (
        <Banner
          variant="critical"
          onDismiss={() => setBannerMessage(undefined)}
        >
          <Banner.Title hidden>错误</Banner.Title>
          {bannerMessage}
        </Banner>
      )}
    </form>
  );
}
