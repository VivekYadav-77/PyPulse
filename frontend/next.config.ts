import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/run/",
        destination: "http://localhost:8000/api/run/",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
