"use client";

import { useActionState, useEffect, useState } from "react";
import registerSession from "./registerSession";
import {
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  TextInput,
} from "@primer/react";
import { SyncIcon } from "@primer/octicons-react";
import { CopyButton } from "@/components";
import {
  validateLguid,
  validatePassword,
  validateUsername,
} from "@/utils/validate";
import registerUser from "./registerUser";
import { Banner } from "@primer/react/experimental";
import { useRouter } from "next/navigation";
import {
  checkUserExistsByLguid,
  checkUserExistsByUsername,
} from "../checkUserExits";

export default function RegisterForm() {
  const router = useRouter();
  const [session, setSession] = useState<string | false | undefined>();
  const [inputLguid, setInputLguid] = useState<string | undefined>();
  const [inputUsername, setInputUsername] = useState<string | undefined>();
  const [inputPassword, setInputPassword] = useState<string | undefined>();
  const [inputLguidValidateMessage, setInputLguidValidateMessage] = useState<
    string | boolean | undefined
  >();
  const [inputUsernameValidateMessage, setInputUsernameValidateMessage] =
    useState<string | boolean | undefined>();
  const [inputPasswordValidateMessage, setInputPasswordValidateMessage] =
    useState<string | boolean | undefined>();
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  function updateRegisterSession() {
    return registerSession().then(
      (s) => setSession(s),
      (err) => {
        console.error("Error when get registerSession", err);
        setSession(false);
      }
    );
  }
  const [, submitAction, isPending] = useActionState(async () => {
    setBannerMessage(undefined);
    const inputLguidVal = validateLguid(inputLguid || "");
    const inputUsernameVal = validateUsername(inputUsername || "");
    const inputPasswordVal = validatePassword(inputPassword || "");
    if (!session || inputLguidVal || inputUsernameVal || inputPasswordVal) {
      setInputLguidValidateMessage(inputLguidVal);
      setInputUsernameValidateMessage(inputUsernameVal);
      setInputPasswordValidateMessage(inputPasswordVal);
      return;
    }
    try {
      const res = await registerUser(
        session,
        inputUsername!,
        parseInt(inputLguid!),
        inputPassword!
      );
      if (res === "UnknownError") throw new Error("Unknown server error");
      if (res === "LguidExists") {
        setInputLguidValidateMessage("已被注册");
        return;
      }
      if (res === "UsernameExists") {
        setInputUsernameValidateMessage("已被注册");
        return;
      }
      if (res === "UnknownSession") {
        setBannerMessage("session 无效，也许已经过期，请重新获取。");
        return;
      }
      if (res === "LuoguUserNotFound") {
        setInputLguidValidateMessage("该用户不存在");
        return;
      }
      if (res === "SessionMismatch") {
        setBannerMessage("个人签名与 session 不匹配，请仔细检查。");
        return;
      }
      setBannerMessage(undefined);
      router.push("/auth/login?username=" + res.username);
      return;
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when submit register form:", e);
      return;
    }
  }, undefined);
  useEffect(() => {
    updateRegisterSession();
  }, []);
  useEffect(() => {
    let ignore = false;
    if (inputLguidValidateMessage === false)
      checkUserExistsByLguid(parseInt(inputLguid!)).then(
        (v) => {
          if (ignore) return;
          setInputLguidValidateMessage(v ? "已被注册" : true);
        },
        (err) => {
          if (ignore) return;
          setInputLguidValidateMessage(undefined);
          console.error("Error when try to check lguid exists", err);
        }
      );
    if (inputUsernameValidateMessage === false)
      checkUserExistsByUsername(inputUsername!).then(
        (v) => {
          if (ignore) return;
          setInputUsernameValidateMessage(v ? "已被注册" : true);
        },
        (err) => {
          if (ignore) return;
          setInputLguidValidateMessage(undefined);
          console.error("Error when try to check username exists", err);
        }
      );
    if (inputPasswordValidateMessage === false)
      // 为了好看
      Promise.resolve().then(() => {
        if (ignore) return;
        setInputPasswordValidateMessage(true);
      });
    return () => void (ignore = true);
  }, [
    inputLguid,
    inputUsername,
    inputPassword,
    inputLguidValidateMessage,
    inputUsernameValidateMessage,
    inputPasswordValidateMessage,
  ]);
  return (
    <form
      action={submitAction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-size-8)",
      }}
    >
      {bannerMessage && (
        <Banner
          variant="critical"
          onDismiss={() => setBannerMessage(undefined)}
        >
          <Banner.Title hidden>错误</Banner.Title>
          {bannerMessage}
        </Banner>
      )}
      <FormControl>
        <FormControl.Label>注册 session</FormControl.Label>
        <TextInput
          name="session"
          block
          value={session === false ? "出现异常 请查看控制台" : session || ""}
          aria-invalid={!session}
          loading={session === undefined}
          readOnly
          monospace
          {...(session === false
            ? {
                validationStatus: "error",
                style: { color: "var(--fgColor-danger)" },
              }
            : {})}
          trailingAction={
            <ButtonGroup>
              <CopyButton
                onCopy={async () => {
                  if (!session) return false;
                  return await navigator.clipboard.writeText(session).then(
                    () => true,
                    () => false
                  );
                }}
              />
              <IconButton
                variant="invisible"
                aria-labelledby="刷新"
                icon={SyncIcon}
                onClick={() => {
                  setSession(undefined);
                  updateRegisterSession();
                }}
              />
            </ButtonGroup>
          }
          style={{ textOverflow: "ellipsis", cursor: "pointer" }}
        />
      </FormControl>
      <FormControl required>
        <FormControl.Label>洛谷 UID</FormControl.Label>
        <TextInput
          name="lguid"
          block
          value={inputLguid || ""}
          loading={inputLguidValidateMessage === false}
          onChange={(e) => {
            setInputLguid(e.target.value);
            if (typeof inputLguidValidateMessage === "boolean")
              setInputLguidValidateMessage(undefined);
            if (typeof inputLguidValidateMessage === "string")
              setInputLguidValidateMessage(validateLguid(e.target.value));
          }}
          onBlur={(e) =>
            setInputLguidValidateMessage(validateLguid(e.target.value) || false)
          }
          aria-invalid={typeof inputLguidValidateMessage === "string"}
        />
        {inputLguidValidateMessage === true ? (
          <FormControl.Validation variant="success">
            未被占用
          </FormControl.Validation>
        ) : (
          inputLguidValidateMessage && (
            <FormControl.Validation variant="error">
              {inputLguidValidateMessage}
            </FormControl.Validation>
          )
        )}
      </FormControl>
      <FormControl required>
        <FormControl.Label>用户名</FormControl.Label>
        <TextInput
          name="username"
          block
          value={inputUsername || ""}
          loading={inputUsernameValidateMessage === false}
          onChange={(e) => {
            setInputUsername(e.target.value);
            if (typeof inputUsernameValidateMessage === "boolean")
              setInputUsernameValidateMessage(undefined);
            if (typeof inputUsernameValidateMessage === "string")
              setInputUsernameValidateMessage(validateUsername(e.target.value));
          }}
          onBlur={(e) =>
            setInputUsernameValidateMessage(
              validateUsername(e.target.value) || false
            )
          }
          aria-invalid={typeof inputUsernameValidateMessage === "string"}
          autoComplete="username"
        />
        {inputUsernameValidateMessage === true ? (
          <FormControl.Validation variant="success">
            未被占用
          </FormControl.Validation>
        ) : (
          inputUsernameValidateMessage && (
            <FormControl.Validation variant="error">
              {inputUsernameValidateMessage}
            </FormControl.Validation>
          )
        )}
        <FormControl.Caption>
          由数字、字母、下划线构成，不得以数字开头，长度在 3 到 16 之间
        </FormControl.Caption>
      </FormControl>
      <FormControl required>
        <FormControl.Label>密码</FormControl.Label>
        <TextInput
          name="password"
          block
          value={inputPassword || ""}
          loading={inputPasswordValidateMessage === false}
          type="password"
          onChange={(e) => {
            setInputPassword(e.target.value);
            if (typeof inputPasswordValidateMessage === "boolean")
              setInputPasswordValidateMessage(undefined);
            if (typeof inputPasswordValidateMessage === "string")
              setInputPasswordValidateMessage(validatePassword(e.target.value));
          }}
          onBlur={(e) =>
            setInputPasswordValidateMessage(
              validatePassword(e.target.value) || false
            )
          }
          aria-invalid={typeof inputPasswordValidateMessage === "string"}
          autoComplete="new-password"
        />
        {inputPasswordValidateMessage === true ? (
          <FormControl.Validation variant="success">
            密码符合要求
          </FormControl.Validation>
        ) : (
          inputPasswordValidateMessage && (
            <FormControl.Validation variant="error">
              {inputPasswordValidateMessage}
            </FormControl.Validation>
          )
        )}
        <FormControl.Caption>至少 6 个字符</FormControl.Caption>
      </FormControl>
      <Button type="submit" disabled={isPending}>
        注册
      </Button>
    </form>
  );
}
