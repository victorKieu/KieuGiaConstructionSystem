/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Loại bỏ swcMinify vì không được hỗ trợ trong Next.js 15
  // swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
