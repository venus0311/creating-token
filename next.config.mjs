/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  env: {
    HELUIS_RPC_URL: process.env.HELUIS_RPC_URL
  }
};

export default nextConfig;

