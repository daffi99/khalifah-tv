import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Next.js Image component to load from R2 public URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Transpile Vidstack for SSR compatibility
  transpilePackages: ["@vidstack/react"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;

