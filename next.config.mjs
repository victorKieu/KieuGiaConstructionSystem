/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'placehold.co'],
    unoptimized: true,
  },
  // Tắt hoàn toàn static generation
  output: 'standalone',
  experimental: {
    // Tắt tính năng static generation cho các API routes
    serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
    // Tắt tính năng build traces để tránh lỗi Maximum call stack size exceeded
    disableOptimizedLoading: true,
    optimizeCss: false,
  },
}

export default nextConfig
