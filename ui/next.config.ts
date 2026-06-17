import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@partpilot/data-engine"],
  serverExternalPackages: ["pg", "pg-native"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      // pg uses native C bindings — must not be bundled by webpack
      (config.externals as string[]).push("pg", "pg-native", "pg-cloudflare");
    }
    return config;
  },
};

export default nextConfig;
