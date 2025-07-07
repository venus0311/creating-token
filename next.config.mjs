/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  env: {
    HELUIS_RPC_URL: process.env.HELUIS_RPC_URL
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /HeartbeatWorker.*\.js$/,
      type: 'javascript/esm',
    });
    return config;
  },
};

export default nextConfig;

