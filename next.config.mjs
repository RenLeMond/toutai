/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  transpilePackages: ['reshaped'],
  experimental: {
    optimizePackageImports: ['reshaped']
  },
  turbopack: {
    root: import.meta.dirname
  }
};

export default nextConfig;
