import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['reshaped'],
  experimental: {
    optimizePackageImports: ['reshaped']
  },
  turbopack: {
    root: import.meta.dirname
  }
};

export default nextConfig;
