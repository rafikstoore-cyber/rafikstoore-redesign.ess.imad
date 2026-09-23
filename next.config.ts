import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photography is served directly from the Pexels CDN (already resized via URL params).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
