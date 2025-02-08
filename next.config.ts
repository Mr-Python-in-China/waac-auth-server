import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Authlib-Injector-API-Location",
            value: "/yggdrasil",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
