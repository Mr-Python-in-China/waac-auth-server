import ProfilenameInput from "@/components/profileNameInput";
import { validateProfilename } from "@/utils/validate";
import {
  Dialog,
  FormControl,
  Radio,
  RadioGroup,
  TextInput,
} from "@primer/react";
import { Banner } from "@primer/react/experimental";
import { useState, useEffect, useActionState } from "react";
import {
  deleteProfile,
  deleteProfileCapeTexture,
  setProfileCapeTexture,
  setProfileModel,
  setProfileName,
  setProfileSkinTexture,
} from "./editProfile";
import Profile from "../profileClass";
import { UploadFileDiv } from "@/components/uploadFileDiv";
import readFile from "@/utils/readFile";

export function EditNameDialog({
  profileId,
  defaultValue,
  onClose,
  onSuccess,
}: {
  profileId: string;
  defaultValue?: string;
  onClose: () => void;
  onSuccess: (v: Profile) => void;
}) {
  const [inputProfilename, setInputProfileName] = useState(defaultValue);
  const [inputProfilenameValidateMessage, setInputProfileNameValidateMessage] =
    useState<string | boolean | undefined>(
      defaultValue?.length ? false : undefined
    );
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  useEffect(() => setInputProfileName(defaultValue), [defaultValue]);
  const [, action, isPending] = useActionState(async () => {
    const inputProfilenameVal = validateProfilename(inputProfilename || "");
    if (inputProfilenameVal) {
      setInputProfileNameValidateMessage(inputProfilenameVal);
      return;
    }
    try {
      const res = await setProfileName(profileId, inputProfilename || "");
      if (res === "ProfileNameExists") {
        setInputProfileNameValidateMessage("已被注册");
        return;
      }
      if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else if (typeof res === "string") res satisfies never;
      else onSuccess(res);
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when submit edit name form:", e);
      return;
    }
  }, undefined);
  return (
    <Dialog
      title="编辑名称"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
      footerButtons={[
        {
          buttonType: "primary",
          content: "确定",
          type: "submit",
          disabled: isPending,
          form: "editNameDialogForm",
        },
      ]}
    >
      <form action={action} id="editNameDialogForm">
        {bannerMessage && (
          <Banner
            variant="critical"
            onDismiss={() => setBannerMessage(undefined)}
          >
            <Banner.Title hidden>错误</Banner.Title>
            {bannerMessage}
          </Banner>
        )}
        <ProfilenameInput
          value={inputProfilename}
          setValue={setInputProfileName}
          validateMessage={inputProfilenameValidateMessage}
          setValidateMessage={setInputProfileNameValidateMessage}
          ignoredId={[profileId]}
        />
      </form>
    </Dialog>
  );
}

export function EditModelDialog({
  profileId,
  defaultValue,
  onClose,
  onSuccess,
}: {
  profileId: string;
  defaultValue?: "default" | "slim";
  onClose: () => void;
  onSuccess: (v: Profile) => void;
}) {
  const [inputProfileModel, setInputProfileModel] = useState(defaultValue);
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  useEffect(() => setInputProfileModel(defaultValue), [defaultValue]);
  const [, action, isPending] = useActionState(async () => {
    try {
      const res = await setProfileModel(profileId, inputProfileModel!);
      if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else if (typeof res === "string") res satisfies never;
      else onSuccess(res);
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when submit edit model form:", e);
      return;
    }
  }, undefined);
  return (
    <Dialog
      title="选择模型"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
      footerButtons={[
        {
          buttonType: "primary",
          content: "确定",
          type: "submit",
          form: "editModelDialogForm",
          disabled: isPending,
        },
      ]}
      width="small"
    >
      <form action={action} id="editModelDialogForm">
        {bannerMessage && (
          <Banner
            variant="critical"
            onDismiss={() => setBannerMessage(undefined)}
          >
            <Banner.Title hidden>错误</Banner.Title>
            {bannerMessage}
          </Banner>
        )}
        <RadioGroup name="editModelDialogRadioGroup" aria-labelledby="选择模型">
          <FormControl>
            <Radio
              value={"Steve"}
              checked={inputProfileModel === "default"}
              onChange={() => setInputProfileModel("default")}
            />
            <FormControl.Label>Steve</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio
              value={"Alex"}
              checked={inputProfileModel === "slim"}
              onChange={() => setInputProfileModel("slim")}
            />
            <FormControl.Label>Alex</FormControl.Label>
          </FormControl>
        </RadioGroup>
      </form>
    </Dialog>
  );
}
export function UploadSkinDialog({
  profileId,
  onClose,
  onSuccess,
}: {
  profileId: string;
  onClose: () => void;
  onSuccess: (v: Profile) => void;
}) {
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  async function action(file: File) {
    setBannerMessage(undefined);
    const data = await readFile(file);
    if (data.length >= 5e5) {
      setBannerMessage("文件过大。");
      return;
    }
    try {
      setIsPending(true);
      const res = await setProfileSkinTexture(profileId, data);
      setIsPending(false);
      if (res === "InvalidSize") setBannerMessage("图片尺寸不合法。");
      else if (res === "InvaildImage") setBannerMessage("无法处理该图片。");
      else if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else if (typeof res === "string") res satisfies never;
      else onSuccess(res);
    } catch (e) {
      setIsPending(false);
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when upload skin:", e);
    }
  }
  return (
    <Dialog
      title="上传皮肤"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-size-16)",
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
        <div>请上传一张图片，尺寸为 64x64 或 64x32，推荐 PNG 格式。</div>
        <UploadFileDiv
          processFile={action}
          style={{ width: "100%", height: "200px" }}
          uploadPorgess={isPending}
          acceptedTypes="image/*"
        />
      </div>
    </Dialog>
  );
}
export function UploadCapeDialog({
  profileId,
  onClose,
  onSuccess,
}: {
  profileId: string;
  onClose: () => void;
  onSuccess: (v: Profile) => void;
}) {
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  async function action(file: File) {
    setBannerMessage(undefined);
    const data = await readFile(file);
    if (data.length >= 5e5) {
      setBannerMessage("文件过大。");
      return;
    }
    try {
      setIsPending(true);
      const res = await setProfileCapeTexture(profileId, data);
      setIsPending(false);
      if (res === "InvalidSize") setBannerMessage("图片尺寸不合法。");
      else if (res === "InvaildImage") setBannerMessage("无法处理该图片。");
      else if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else if (typeof res === "string") res satisfies never;
      else onSuccess(res);
    } catch (e) {
      setIsPending(false);
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when upload cape:", e);
    }
  }
  return (
    <Dialog
      title="上传皮肤"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-size-16)",
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
        <div>请上传一张图片，尺寸为 64x32，推荐 PNG 格式。</div>
        <UploadFileDiv
          processFile={action}
          style={{ width: "100%", height: "200px" }}
          uploadPorgess={isPending}
          acceptedTypes="image/*"
        />
      </div>
    </Dialog>
  );
}
export function DeleteCapeDialog({
  profileId,
  onClose,
  onSuccess,
}: {
  profileId: string;
  onClose: () => void;
  onSuccess: (v: Profile) => void;
}) {
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [, action, isPending] = useActionState(async () => {
    try {
      const res = await deleteProfileCapeTexture(profileId);
      if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else if (typeof res === "string") res satisfies never;
      else onSuccess(res);
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when delete cape:", e);
      return;
    }
  }, undefined);
  return (
    <Dialog
      title="删除披风"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
      footerButtons={[
        {
          buttonType: "primary",
          content: "确定",
          type: "submit",
          form: "deleteCapeDialogForm",
          disabled: isPending,
        },
        {
          buttonType: "default",
          content: "取消",
          onClick: onClose,
          disabled: isPending,
        },
      ]}
      width="small"
    >
      <form action={action} id="deleteCapeDialogForm">
        {bannerMessage && (
          <Banner
            variant="critical"
            onDismiss={() => setBannerMessage(undefined)}
          >
            <Banner.Title hidden>错误</Banner.Title>
            {bannerMessage}
          </Banner>
        )}
        <div>确定要删除披风吗？</div>
      </form>
    </Dialog>
  );
}
export function DeleteProfileDialog({
  profileId,
  onClose,
}: {
  profileId: string;
  onClose: () => void;
}) {
  const [bannerMessage, setBannerMessage] = useState<string | undefined>();
  const [deleteConformInput, setDeleteConformInput] = useState<string>("");
  const [, action, isPending] = useActionState(async () => {
    if (deleteConformInput !== profileId) return;
    try {
      const res = await deleteProfile(profileId);
      if (res === "UnknownError") throw new Error("Unknown server error.");
      else if (res === "NoAccess")
        setBannerMessage("无权操作。重新登录后重试。");
      else res satisfies never;
    } catch (e) {
      setBannerMessage("未知错误，请查看控制台。");
      console.error("Error when delete profile:", e);
      return;
    }
  }, undefined);
  return (
    <Dialog
      title="删除账户"
      onClose={() => {
        setBannerMessage(undefined);
        onClose();
      }}
      footerButtons={[
        {
          buttonType: "danger",
          content: "删除",
          type: "submit",
          form: "deleteProfileDialogForm",
          disabled: isPending || deleteConformInput !== profileId,
        },
        {
          buttonType: "default",
          content: "取消",
          onClick: onClose,
          disabled: isPending,
        },
      ]}
    >
      <form
        action={action}
        id="deleteProfileDialogForm"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--base-size-16)",
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
        <Banner variant="warning">
          <Banner.Title hidden>警告</Banner.Title>
          <div>账户的 ID 在创建账户时随机生成，是账户的唯一标识。</div>
          <div>游戏内的相关数据都与该账户绑定。</div>
          <div>删除账户后，数据将无法恢复。请仔细确认！</div>
        </Banner>
        <div>
          如果你确认你要删除该账户，请在下方输入框内输入角色 ID{" "}
          <code>{profileId}</code>。
        </div>
        <TextInput
          block
          value={deleteConformInput}
          onChange={(e) => setDeleteConformInput(e.target.value)}
          placeholder={profileId}
        />
      </form>
    </Dialog>
  );
}
