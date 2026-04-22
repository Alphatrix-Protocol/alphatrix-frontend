import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@privy-io/react-auth"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "polymarket-upload.s3.us-east-2.amazonaws.com" },
      { protocol: "https", hostname: "*.polymarket.com" },
      { protocol: "https", hostname: "*.ipfs.dweb.link" },
      { protocol: "https", hostname: "*.bayse.markets" },
      { protocol: "https", hostname: "gowagr.s3.eu-west-2.amazonaws.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
};

export default nextConfig;
