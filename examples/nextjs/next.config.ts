import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.react-photo-album.com" }],
  },
};

export default nextConfig;
