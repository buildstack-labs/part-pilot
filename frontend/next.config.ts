import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@partpilot/backend"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
