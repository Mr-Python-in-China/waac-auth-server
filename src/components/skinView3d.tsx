import { useRef, useEffect } from "react";
import { SkinViewer } from "skinview3d";

export default function SkinView3D({
  skinUrl,
  capeUrl,
  width,
  height,
  name,
  backgroundColor,
  model = "default",
}: {
  skinUrl: string;
  capeUrl?: string;
  width: number;
  height: number;
  name?: string;
  backgroundColor?: string;
  model?: "slim" | "default";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: canvasRef.current is null."
      );
      return;
    }
    viewerRef.current = new SkinViewer({
      canvas: canvasRef.current,
      zoom: 0.8,
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
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    viewerRef.current.loadSkin(skinUrl, { model });
  }, [skinUrl, model]);
  useEffect(() => {
    if (viewerRef.current === null) {
      console.warn(
        "Unexpected behavior in component SkinView3D: viewerRef.current is null."
      );
      return;
    }
    if (capeUrl) viewerRef.current.loadCape(capeUrl);
    else viewerRef.current.loadCape(null);
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

  return (
    <canvas ref={canvasRef} style={{ display: "block", backgroundColor }} />
  );
}
