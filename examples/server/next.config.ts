import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "assets.react-photo-album.com" }],
  },
};

export default nextConfig;
