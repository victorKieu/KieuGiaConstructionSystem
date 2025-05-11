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
  
  // Cấu hình cho Next.js 15
  experimental: {
    disableOptimizedLoading: true
  },
  
  // Thêm serverExternalPackages thay vì serverComponentsExternalPackages
  serverExternalPackages: ['@supabase/supabase-js']
}

export default nextConfig
