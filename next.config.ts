import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [{ source: "/.well-known/webmcp", destination: "/.well-known/webmcp.json" }];
  },
};

export default nextConfig;
