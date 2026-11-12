/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
