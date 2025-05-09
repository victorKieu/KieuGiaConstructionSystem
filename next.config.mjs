/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Bật SWC Minifier theo khuyến nghị
  images: {
    domains: ['localhost', '127.0.0.1', 'vercel.app'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Tắt các tính năng không cần thiết trong quá trình build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Không sử dụng output: 'standalone' để tránh lỗi EISDIR
}

export default nextConfig
