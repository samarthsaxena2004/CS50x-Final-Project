import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Allow Firebase Uploads
      },
      {
        protocol: 'https',
        hostname: 'd33v4339jhl8k0.cloudfront.net', // Allow the link you pasted
      },
      {
        protocol: 'https',
        hostname: '**', // Optional: Allow ALL external images (Use with caution)
      }
    ],
  },
};

export default nextConfig;