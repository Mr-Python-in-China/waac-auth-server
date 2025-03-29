import { AppLayout } from "@/components/appLayout";
import { MAP_URL } from "@/constants";
import { notFound } from "next/navigation";

export default async function MapPage() {
  if (MAP_URL === undefined) notFound();
  return (
    <AppLayout tab="地图">
      <iframe
        src={MAP_URL}
        style={{
          border: 0,
          display: "block",
          width: "calc(100vw - 55px - 55px)",
          height: "calc(100vh - 55px - 55px - 55px)",
          margin: "55px 55px auto 55px",
          borderRadius: "var(--borderRadius-medium)",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.6)",
        }}
        allow="fullscreen"
      ></iframe>
    </AppLayout>
  );
}
