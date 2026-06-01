import type { NextConfig } from "next";

const r2BaseUrl = process.env.R2_PUBLIC_BASE_URL || "https://pub-069727a93f1a401c90cc0209105bd77b.r2.dev";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination: `${r2BaseUrl.replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
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

