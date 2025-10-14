/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Disable ESLint checks during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚫 Skip type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
