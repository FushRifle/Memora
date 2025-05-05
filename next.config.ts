import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static page generation checks
  output: 'standalone', // or 'export' if you're doing static export
  // Skip linting during build
  experimental: {
    esmExternals: 'loose',
    missingSuspenseWithCSRBailout: false,
  },
  // Completely disable React strict mode (helps with some warnings)
  reactStrictMode: false,
};

module.exports = nextConfig;

export default nextConfig;
