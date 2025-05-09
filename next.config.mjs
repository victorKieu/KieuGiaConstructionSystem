/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Loại bỏ output: 'standalone' để tránh lỗi khi build
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "app.kieugia-construction.biz.vn"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
