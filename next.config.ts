import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    // Enable better hot reloading
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
