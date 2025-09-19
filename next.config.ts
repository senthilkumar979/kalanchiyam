import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Allow up to 10MB file uploads
    },
  },
};

export default nextConfig;
