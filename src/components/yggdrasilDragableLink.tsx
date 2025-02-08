"use client";

import { Link as PrimerLink } from "@primer/react";

export default function YggdrasilDragableLink({
  baseUrl,
}: {
  baseUrl: string;
}) {
  return (
    <PrimerLink
      as="span"
      draggable
      onDragStart={(event) => {
        const yggdrasilApiRoot = baseUrl + "/yggdrasil";
        const uri =
          "authlib-injector:yggdrasil-server:" +
          encodeURIComponent(yggdrasilApiRoot);
        event.dataTransfer.setData("text/plain", uri);
        event.dataTransfer.dropEffect = "copy";
      }}
    >
      将此链接拖动至启动器即可添加外部登录方式。
    </PrimerLink>
  );
}
