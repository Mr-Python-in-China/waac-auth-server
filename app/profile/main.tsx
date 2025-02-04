"use client";

import styled from "styled-components";
import { useAuthLogined } from "../../src/components/authContext";
import { useActionState, useEffect, useState } from "react";
import { listProfiles } from "./listProfiles";
import { Banner, Blankslate } from "@primer/react/experimental";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button, FormControl, TextInput } from "@primer/react";
import { validateProfilename } from "@/utils/validate";
import { checkProfileExits } from "./checkProfileExits";
import createProfile from "./createProfile";
import SkinView3D from "@/components/skinView3d";
import { toBase64 } from "@/utils/base64";
import Link from "@/components/link";

export interface Profile {
  name: string;
  id: string;
  createdAt: Date;
  skin: {
    data: Uint8Array;
    hash: Uint8Array;
  };
  cape: {
    data: Uint8Array;
    hash: Uint8Array;
  } | null;
}

const Card = styled.div`
  background-color: var(--card-bgColor);
  box-shadow: var(--shadow-resting-small);
  border: var(--borderWidth-thin, 1px) solid var(--borderColor-default);
  border-radius: var(--borderRadius-medium);
  width: 300px;
  height: 400px;
`;
const CardProfileLink = styled(Link)`
  display: flex;
  gap: var(--base-size-8);
  flex-direction: column;
  color: var(--fgColor-default);
  padding: var(--base-size-8);
  transition: background 0.12s ease-out;
  text-decoration: none;
  border: none;
  background-color: transparent;
  &:hover {
    background: var(--control-transparent-bgColor-hover);
    cursor: pointer;
  }
`;
const CardGrid = styled.div`
  display: grid;
  grid-gap: var(--base-size-16);
  grid-template-columns: repeat(auto-fit, 300px);
`;

export default function Main({
  initProfileList,
}: {
  initProfileList: Awaited<ReturnType<typeof listProfiles>>;
}) {
  const [profiles, setProfiles] = useState<
    Awaited<ReturnType<typeof listProfiles>> | undefined
  >(initProfileList);
  const loadingProfiles = () =>
    listProfiles()
      .then((x) => {
        if (typeof x !== "string") setProfiles(x);
        else if (x === "UnknownError") throw new Error("Unknown server error.");
        else x satisfies never;
      })
      .catch((e) => {
        console.error("Error when try to get profiles list", e);
        setProfiles("UnknownError");
      });
  return (
    <div
      style={{
        marginLeft: "var(--base-size-16)",
        marginRight: "var(--base-size-16)",
        marginTop: "var(--base-size-16)",
      }}
    >
      {profiles === undefined ? undefined : typeof profiles === "string" ? (
        <Banner
          title="出现错误"
          description={
            profiles === "UnknownError"
              ? "未知错误，请查看控制台。"
              : (profiles satisfies never)
          }
          variant="critical"
          primaryAction={
            <Banner.PrimaryAction
              onClick={() => (setProfiles(undefined), loadingProfiles())}
            >
              重试
            </Banner.PrimaryAction>
          }
        />
      ) : profiles.length === 0 ? (
        <ProfileBlankState reload={loadingProfiles} />
      ) : (
        <CardGrid>
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
          <CreateProfileCard onSuccess={loadingProfiles} />
        </CardGrid>
      )}
    </div>
  );
}

function ProfileBlankState({ reload }: { reload: () => void }) {
  const user = useAuthLogined();
  return (
    <Blankslate border narrow>
      <Blankslate.Visual>
        <FontAwesomeIcon icon={faUsers} size="3x" />
      </Blankslate.Visual>
      <Blankslate.Heading>没有角色</Blankslate.Heading>
      <Blankslate.Description>
        你需要创建一个角色才能进入游戏。
        <br />
        创建角色后，你可以更改角色的名称、皮肤与披风。
      </Blankslate.Description>
      <div style={{ width: "254px" }}>
        <CreateProfileForm defaultValue={user.username} onSuccess={reload} />
      </div>
    </Blankslate>
  );
}

function CreateProfileForm({
  defaultValue,
  onSuccess,
}: {
  defaultValue?: string;
  onSuccess: () => void;
}) {
  const [inputProfilename, setInputProfileName] = useState(defaultValue);
  const [inputProfilenameValidateMessage, setInputProfileNameValidateMessage] =
    useState<string | boolean | undefined>(
      defaultValue?.length ? false : undefined
    );
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [, action, isPending] = useActionState(async () => {
    const inputProfilenameVal = validateProfilename(inputProfilename || "");
    if (inputProfilenameVal) {
      setInputProfileNameValidateMessage(inputProfilenameVal);
      return;
    }
    try {
      const res = await createProfile(inputProfilename!);
      if (res === "ProfileNameExists") {
        setInputProfileNameValidateMessage("已被注册");
        return;
      }
      if (res === "UnknownError") throw new Error("Unknown server error.");
      if (typeof res === "string") res satisfies never;
      onSuccess();
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when submit createProfile form:", e);
      return;
    }
  }, undefined);
  return (
    <form
      action={action}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-size-8)",
      }}
    >
      <ProfilenameInput
        value={inputProfilename}
        setValue={setInputProfileName}
        validateMessage={inputProfilenameValidateMessage}
        setValidateMessage={setInputProfileNameValidateMessage}
      />
      <Button type="submit" disabled={isPending} variant="primary">
        创建角色
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

function ProfilenameInput({
  value: inputProfilename,
  setValue: setInputProfilename,
  validateMessage,
  setValidateMessage,
}: {
  value: string | undefined;
  setValue: (s: string | undefined) => void;
  validateMessage: string | boolean | undefined;
  setValidateMessage: (s: string | boolean | undefined) => void;
}) {
  useEffect(() => {
    let ignore = false;
    if (validateMessage === false)
      checkProfileExits(inputProfilename!).then((v) => {
        if (ignore) return;
        setValidateMessage(v ? "已被注册" : true);
      });
    return () => void (ignore = true);
  });
  return (
    <FormControl>
      <FormControl.Label>角色名</FormControl.Label>
      <TextInput
        block
        value={inputProfilename || ""}
        onChange={(e) => {
          setInputProfilename(e.target.value);
          if (typeof validateMessage === "boolean")
            setValidateMessage(undefined);
          if (typeof validateMessage === "string")
            setValidateMessage(validateProfilename(e.target.value));
        }}
        onBlur={(e) =>
          setValidateMessage(validateProfilename(e.target.value) || false)
        }
        loading={validateMessage === false}
        aria-invalid={typeof validateMessage === "string"}
      />
      {validateMessage === true ? (
        <FormControl.Validation variant="success">
          未被占用
        </FormControl.Validation>
      ) : (
        validateMessage && (
          <FormControl.Validation variant="error">
            {validateMessage}
          </FormControl.Validation>
        )
      )}
      <FormControl.Caption>
        由数字、字母、下划线构成，不得以数字开头，长度在 3 到 16 之间
      </FormControl.Caption>
    </FormControl>
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card>
      <SkinView3D
        height={300 * 1.1}
        width={298}
        skinUrl={"data:image/png;base64," + toBase64(profile.skin.data)}
        capeUrl={
          profile.cape
            ? "data:image/png;base64," + toBase64(profile.cape.data)
            : undefined
        }
        name={profile.name}
        backgroundColor="var(--bgColor-muted)"
        key={profile.skin.hash + ";" + (profile.cape?.hash || undefined)}
      />
      <CardProfileLink href={"/profile/" + profile.id}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "var(--text-title-size-small)",
          }}
        >
          {profile.name}
        </div>
        <div style={{ color: "var(--fgColor-muted)" }}>
          Created at: {profile.createdAt.toLocaleString()}
        </div>
      </CardProfileLink>
    </Card>
  );
}
function CreateProfileCard({ onSuccess }: { onSuccess: () => void }) {
  const [showState, setShowState] = useState(false);
  return (
    <Card>
      {showState ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "var(--base-size-16)",
            marginRight: "var(--base-size-16)",
          }}
        >
          <CreateProfileForm
            onSuccess={() => {
              setShowState(false);
              onSuccess();
            }}
          />
        </div>
      ) : (
        <CardProfileLink
          as="button"
          onClick={() => setShowState(true)}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--base-size-12)",
          }}
        >
          <FontAwesomeIcon icon={faPlus} size="4x" />
          <div style={{ fontSize: "var(--text-title-size-medium)" }}>
            创建角色
          </div>
        </CardProfileLink>
      )}
    </Card>
  );
}
