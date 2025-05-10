/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt static generation để tránh lỗi khi sử dụng Supabase
  output: 'standalone',
  
  // Bỏ qua lỗi ESLint và TypeScript trong quá trình build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Tắt SWC Minify để tránh lỗi
  swcMinify: false,
}

export default nextConfig
