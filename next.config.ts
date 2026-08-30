import type { NextConfig } from "next";
import { WEBMCP_ORIGIN_TRIAL_TOKEN } from "./src/webmcp/origin-trial";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Origin-Trial", value: WEBMCP_ORIGIN_TRIAL_TOKEN }],
      },
    ];
  },
  async rewrites() {
    return [{ source: "/.well-known/webmcp", destination: "/.well-known/webmcp.json" }];
  },
};

export default nextConfig;
