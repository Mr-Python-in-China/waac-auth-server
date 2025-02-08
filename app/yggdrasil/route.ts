import { BASE_URL, DOMAIN } from "@/constants";
import { NextResponse } from "next/server";
import { publicKey } from "@/signatureKey";
import PackageMeta from "@/../package.json";

export function GET(): NextResponse {
  return NextResponse.json({
    meta: {
      serverName: "WAAC",
      implementationName: "WAAC Auth",
      implementationVersion: PackageMeta.version,
      links: {
        homepage: BASE_URL + "/",
        register: BASE_URL + "/auth/register",
      },
      "feature.non_email_login": true,
      "feature.username_check": true,
    },
    skinDomains: [DOMAIN],
    signaturePublickey: publicKey,
  });
}
