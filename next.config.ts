import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    // Enable better hot reloading
    optimizePackageImports: ['lucide-react'],
  },
  env: {
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8014',
  },
};

export default nextConfig;
