import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.152.224'],
  // Cloudflare Pages: output standalone for optimal deployment size
  output: 'standalone',
  // Experimental: better Edge compatibility
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;