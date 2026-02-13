import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.react-photo-album.com" }],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
