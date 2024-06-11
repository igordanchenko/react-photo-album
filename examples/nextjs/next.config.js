/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "assets.react-photo-album.com" }],
  },
};

module.exports = nextConfig;
