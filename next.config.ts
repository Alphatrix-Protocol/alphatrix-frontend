import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@privy-io/react-auth"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
