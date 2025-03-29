import "client-only";
import "./minecraftFont.css";
import FontFaceObserver from "fontfaceobserver";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  ForwardedRef,
  useState,
} from "react";
import { BackEquipment, PlayerAnimation, SkinViewer } from "skinview3d";

export interface SkinView3dProps {
  skinUrl: string;
  capeUrl?: string;
  width: number;
  height: number;
  disableControls?: boolean;
  name?: string;
  backgroundColor?: string;
  model?: "slim" | "default";
  zoom?: number;
  animation?: PlayerAnimation;
  paused?: boolean;
  autoRotate?: boolean;
  backEquipment?: BackEquipment;
  ref?: ForwardedRef<SkinViewer>;
}

function SkinView3DWithoutFontLoader({
  skinUrl,
  capeUrl,
  width,
  height,
  name,
  disableControls,
  backgroundColor,
  model = "default",
  zoom,
  animation,
  paused,
  autoRotate,
  backEquipment,
  ref,
}: SkinView3dProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: canvasRef.current is null."
      );
      return;
    }
    viewerRef.current = new SkinViewer({
      canvas: canvasRef.current,
    });
    return () => {
      viewerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.width = width;
  }, [width]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.height = height;
  }, [height]);
  useEffect(() => {
    console.debug("skin", skinUrl, viewerRef.current);
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.loadSkin(skinUrl, { model });
  }, [skinUrl, model]);
  useEffect(() => {
    console.debug("cape", capeUrl, viewerRef.current);
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    if (capeUrl) viewerRef.current.loadCape(capeUrl);
    else viewerRef.current.resetCape();
  }, [capeUrl]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.nameTag = name ?? null;
  }, [name]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.controls.enabled = !disableControls;
  }, [disableControls]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.zoom = zoom ?? 0.9;
  }, [zoom]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.animation = animation ?? null;
  }, [animation]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    if (viewerRef.current.animation)
      viewerRef.current.animation.paused = paused || false;
  }, [paused]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.autoRotate = autoRotate || false;
  }, [autoRotate]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.playerObject.backEquipment =
      (capeUrl && backEquipment) || null;
  }, [backEquipment, capeUrl]);

  useImperativeHandle(ref, () => {
    if (viewerRef.current === null)
      throw new Error("Error in skinView3D: viewerRef.current is null.");
    return viewerRef.current;
  });

  return (
    <canvas ref={canvasRef} style={{ display: "block", backgroundColor }} />
  );
}

function MinecraftFontLoader({
  children,
  unloaded,
}: {
  children?: React.ReactNode;
  unloaded: React.ReactNode;
}) {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    const font = new FontFaceObserver("Minecraft");
    font.load().then(() => setFontLoaded(true));
  }, []);
  return fontLoaded ? children : unloaded;
}

export default function SkinView3D(props: SkinView3dProps) {
  return (
    <MinecraftFontLoader
      unloaded={
        <div
          style={{
            width: props.width + "px",
            height: props.height + "px",
            backgroundColor: props.backgroundColor,
          }}
        />
      }
    >
      <SkinView3DWithoutFontLoader {...props} />
    </MinecraftFontLoader>
  );
}
