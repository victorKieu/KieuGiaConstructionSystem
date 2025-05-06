/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình hiện tại của bạn
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Bỏ qua các API route trong quá trình build
  experimental: {
    // Các cấu hình experimental hiện tại của bạn
  },
}

export default nextConfig
