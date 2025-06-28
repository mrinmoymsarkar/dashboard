import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Configure headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Configure environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Optimize images
  images: {
    domains: [],
  },

  // Enable experimental features if needed
  experimental: {
    // Enable if you need server actions
    // serverActions: true,
  },
};

export default nextConfig;
