"use client";

import styled from "styled-components";
import Profile from "../profileClass";
import { Button, IconButton } from "@primer/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDove,
  faEdit,
  faFeather,
  faHand,
  faPause,
  faPerson,
  faPersonRunning,
  faPersonWalking,
  faPlay,
  faRotateLeft,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { CopyButton } from "@/components/copyButton";
import { useEffect, useRef, useState } from "react";
import SkinView3D from "@/components/skinView3d";
import { toBase64, toHex } from "@/utils/uint8ArrayUtils";
import {
  DeleteCapeDialog,
  DeleteProfileDialog,
  EditModelDialog,
  EditNameDialog,
  UploadCapeDialog,
  UploadSkinDialog,
} from "./dialogs";
import * as SkinView3dLib from "skinview3d";

const Animations = [
  [new SkinView3dLib.IdleAnimation(), faPerson],
  [new SkinView3dLib.WalkingAnimation(), faPersonWalking],
  [new SkinView3dLib.RunningAnimation(), faPersonRunning],
  [new SkinView3dLib.WaveAnimation(), faHand],
  [new SkinView3dLib.FlyingAnimation(), faDove],
] as const;

const ContentDiv = styled.div`
  padding-left: var(--base-size-16);
  padding-right: var(--base-size-16);
  padding-top: var(--base-size-16);
  margin-left: auto;
  margin-right: auto;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  gap: var(--base-size-32);
  @media screen and (min-width: calc(800px - 1px)) {
    flex-direction: row;
  }
`;
const InfoDiv = styled.div`
  width: 100%;
  @media screen and (min-width: 800px) and (max-width: calc(1000px - 1px)) {
    width: 280px;
  }
  @media screen and (min-width: 1000px) {
    width: 340px;
  }
`;
const InfoList = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--base-size-12);
  font-size: 14px;
`;
const InfoItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  > :nth-child(1) {
    width: 5em;
  }
  > :nth-child(2) {
    flex: 1;
    text-overflow: clip;
    word-break: break-all;
  }
  > :nth-child(3) {
    position: relative;
    height: 0;
    width: 32px;
    > * {
      position: absolute;
      top: -15px;
      width: 32px;
      height: 32px;
    }
  }
  width: 100%;
`;
const SkinViewerBox = styled.div`
  border: var(--borderWidth-thick) solid var(--borderColor-default);
  border-radius: var(--borderRadius-medium);
  background-color: var(--bgColor-muted);
  flex: 1;
  @media screen and (min-width: 800px) {
    width: 0;
  }
  @media screen and (max-width: calc(800px - 1px)) {
    height: 0;
  }
`;
const Hr = styled.hr`
  border-top: 1px solid var(--borderColor-muted);
  border-bottom: unset;
  border-left: unset;
  border-right: unset;
`;

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      variant="invisible"
      icon={() => <FontAwesomeIcon icon={faEdit} />}
      onClick={() => onClick()}
      aria-labelledby="编辑"
    />
  );
}

export default function Main({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [dialog, setDialog] = useState<
    | undefined
    | "editName"
    | "editModel"
    | "uploadSkin"
    | "uploadCape"
    | "deleteCape"
    | "deleteProfile"
  >(undefined);
  const onDialogSuccess = (profile: Profile) => {
    setDialog(undefined);
    setProfile(profile);
  };
  const onDialogClose = () => setDialog(undefined);
  return (
    <ContentDiv>
      <InfoDiv>
        <InfoList>
          <InfoItem>
            <div>名称</div>
            <div>{profile.name}</div>
            <div>
              <EditButton onClick={() => setDialog("editName")} />
            </div>
          </InfoItem>
          <InfoItem>
            <div>模型</div>
            <div>{profile.model === "default" ? "Steve" : "Alex"}</div>
            <div>
              <EditButton onClick={() => setDialog("editModel")} />
            </div>
          </InfoItem>
          <InfoItem>
            <div>ID</div>
            <div>{profile.id}</div>
            <div>
              <CopyButton
                onCopy={async () => {
                  return await navigator.clipboard.writeText(profile.id).then(
                    () => true,
                    () => false
                  );
                }}
              />
            </div>
          </InfoItem>
          <InfoItem>
            <div>创建时间</div>
            <div>{profile.createdAt.toLocaleString()}</div>
          </InfoItem>
        </InfoList>
        <Hr />
        <div
          style={{
            display: "flex",
            gap: "var(--base-size-12)",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: "var(--base-size-12)" }}>
            <Button
              as="a"
              href={"/textures/" + toHex(profile.skin.hash)}
              download={profile.name + "-skin.png"}
            >
              下载皮肤
            </Button>
            <Button onClick={() => setDialog("uploadSkin")}>上传皮肤</Button>
          </div>
          <div style={{ display: "flex", gap: "var(--base-size-12)" }}>
            {profile.cape && (
              <Button
                as="a"
                href={"/textures/" + toHex(profile.cape.hash)}
                download={profile.name + "-cape.png"}
              >
                下载披风
              </Button>
            )}
            <Button onClick={() => setDialog("uploadCape")}>上传披风</Button>
            {profile.cape && (
              <Button onClick={() => setDialog("deleteCape")}>删除披风</Button>
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--base-size-12)" }}>
            <Button variant="danger" onClick={() => setDialog("deleteProfile")}>
              删除角色
            </Button>
          </div>
        </div>
      </InfoDiv>
      <SkinViewer
        skinUrl={"data:image/png;base64," + toBase64(profile.skin.data)}
        capeUrl={
          profile.cape
            ? "data:image/png;base64," + toBase64(profile.cape.data)
            : undefined
        }
        name={profile.name}
        model={profile.model}
      />
      <>
        {dialog === "editName" && (
          <EditNameDialog
            onClose={onDialogClose}
            onSuccess={onDialogSuccess}
            defaultValue={profile.name}
            profileId={profile.id}
          />
        )}
        {dialog === "editModel" && (
          <EditModelDialog
            onClose={onDialogClose}
            onSuccess={onDialogSuccess}
            defaultValue={profile.model}
            profileId={profile.id}
          />
        )}
        {dialog === "uploadSkin" && (
          <UploadSkinDialog
            onClose={onDialogClose}
            onSuccess={onDialogSuccess}
            profileId={profile.id}
          />
        )}
        {dialog === "uploadCape" && (
          <UploadCapeDialog
            onClose={onDialogClose}
            onSuccess={onDialogSuccess}
            profileId={profile.id}
          />
        )}
        {dialog === "deleteCape" && (
          <DeleteCapeDialog
            onClose={onDialogClose}
            onSuccess={onDialogSuccess}
            profileId={profile.id}
          />
        )}
        {dialog === "deleteProfile" && (
          <DeleteProfileDialog onClose={onDialogClose} profileId={profile.id} />
        )}
      </>
    </ContentDiv>
  );
}

function SkinViewer({
  skinUrl,
  capeUrl,
  name,
  model,
}: {
  skinUrl: string;
  capeUrl: string | undefined;
  name?: string;
  model?: "slim" | "default";
}) {
  const [width, setWidth] = useState(0);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [backEquipment, setBackEquipment] =
    useState<import("skinview3d").BackEquipment>("cape");

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinViewer: divRef.current is null."
      );
      return;
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== divRef.current) {
          console.warn(
            "Unexpected behavior in component SkinViewer: unknown entry target."
          );
          continue;
        }
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(divRef.current);
    setWidth(divRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);
  return (
    <SkinViewerBox ref={divRef}>
      <div
        style={{
          borderBottom:
            "var(--borderWidth-thin) solid var(--borderColor-default)",
          display: "flex",
          justifyContent: "end",
        }}
      >
        {capeUrl && (
          <IconButton
            aria-label="切换披风/鞘翅"
            icon={() => <FontAwesomeIcon icon={faFeather} />}
            variant="invisible"
            onClick={() =>
              setBackEquipment(backEquipment === "cape" ? "elytra" : "cape")
            }
          />
        )}
        <AnimationSwitch
          animationIndex={animationIndex}
          setAnimationIndex={setAnimationIndex}
        />
        <IconButton
          aria-label={paused ? "暂停动画" : "播放动画"}
          icon={() => <FontAwesomeIcon icon={paused ? faPlay : faPause} />}
          variant="invisible"
          onClick={() => setPaused(!paused)}
        />
        <IconButton
          aria-label={rotate ? "停止旋转" : "开始旋转"}
          icon={() => (
            <FontAwesomeIcon icon={!rotate ? faRotateLeft : faStop} />
          )}
          variant="invisible"
          onClick={() => setRotate(!rotate)}
        />
      </div>
      <SkinView3D
        width={width}
        height={width * 1.1}
        skinUrl={skinUrl}
        capeUrl={capeUrl}
        model={model}
        name={name}
        zoom={0.6}
        animation={Animations[animationIndex][0]}
        paused={paused}
        autoRotate={rotate}
        backEquipment={backEquipment}
      />
    </SkinViewerBox>
  );
}

function AnimationSwitch({
  animationIndex,
  setAnimationIndex,
}: {
  animationIndex: number;
  setAnimationIndex: (v: number) => void;
}) {
  return (
    <IconButton
      aria-label="切换动画"
      icon={() => <FontAwesomeIcon icon={Animations[animationIndex][1]} />}
      variant="invisible"
      onClick={() =>
        setAnimationIndex((animationIndex + 1) % Animations.length)
      }
    />
  );
}
