"use client";

import styled from "styled-components";
import { useAuthLogined } from "../../src/components/authContext";
import { useActionState, useEffect, useRef, useState } from "react";
import { listProfiles } from "./listProfiles";
import { Banner, Blankslate } from "@primer/react/experimental";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@primer/react";
import { validateProfilename } from "@/utils/validate";
import createProfile from "./createProfile";
import SkinView3D from "@/components/skinView3d";
import { toBase64 } from "@/utils/uint8ArrayUtils";
import Link from "@/components/link";
import ProfilenameInput from "@/components/profileNameInput";
import Profile from "./profileClass";

const CardNoHover = styled.div`
  background-color: var(--card-bgColor);
  box-shadow: var(--shadow-resting-small);
  border: var(--borderWidth-thin) solid var(--borderColor-default);
  border-radius: var(--borderRadius-medium);
  width: 300px;
  height: 400px;
  background-color: transparent;
  text-decoration: none;
  padding: 0;
`;
const Card = styled(CardNoHover)`
  transition: background 0.12s ease-out;
  &:hover {
    background: var(--control-transparent-bgColor-hover);
    cursor: pointer;
  }
`;

const CardProfileInfo = styled.div`
  display: flex;
  gap: var(--base-size-8);
  flex-direction: column;
  color: var(--fgColor-default);
  padding: var(--base-size-8);
`;
const CardGrid = styled.div`
  display: grid;
  grid-gap: var(--base-size-16);
  grid-template-columns: repeat(auto-fit, 300px);
  justify-content: center;
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
        paddingLeft: "var(--base-size-16)",
        paddingRight: "var(--base-size-16)",
        paddingTop: "var(--base-size-16)",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "1280px",
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
  useEffect(() => setInputProfileName(defaultValue), [defaultValue]);
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

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    // @ts-ignore Why error?
    <Card as={Link} href={"/profile/" + profile.id}>
      <ViewProfileSkin profile={profile} />
      <CardProfileInfo>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "var(--text-title-size-small)",
          }}
        >
          {profile.name}
        </div>
        <div style={{ color: "var(--fgColor-muted)" }}>
          创建于 {profile.createdAt.toLocaleString()}
        </div>
      </CardProfileInfo>
    </Card>
  );
}
function CreateProfileCard({ onSuccess }: { onSuccess: () => void }) {
  const [showState, setShowState] = useState(false);
  return showState ? (
    <CardNoHover
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: "var(--base-size-16)",
        paddingRight: "var(--base-size-16)",
      }}
    >
      <CreateProfileForm
        onSuccess={() => {
          setShowState(false);
          onSuccess();
        }}
      />
    </CardNoHover>
  ) : (
    <Card
      as="button"
      onClick={() => setShowState(true)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--base-size-12)",
      }}
    >
      <FontAwesomeIcon icon={faPlus} size="4x" />
      <div style={{ fontSize: "var(--text-title-size-medium)" }}>创建角色</div>
    </Card>
  );
}

function ViewProfileSkin({ profile }: { profile: Profile }) {
  const viewerRef = useRef<import("skinview3d").SkinViewer>(null);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component ViewProfileSkin: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.camera.position.set(35, 20, 35);
  }, []);
  return (
    <div style={{ width: "298px", height: "330px" }}>
      <SkinView3D
        height={330}
        width={298}
        zoom={0.8}
        skinUrl={"data:image/png;base64," + toBase64(profile.skin.data)}
        capeUrl={
          profile.cape
            ? "data:image/png;base64," + toBase64(profile.cape.data)
            : undefined
        }
        name={profile.name}
        backgroundColor="var(--bgColor-muted)"
        disableControls
        model={profile.model}
        ref={viewerRef}
        key={profile.skin.hash + ";" + (profile.cape?.hash || undefined)}
      />
    </div>
  );
}
