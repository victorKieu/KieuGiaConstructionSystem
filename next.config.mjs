/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
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
  // Tắt tính năng thu thập build traces
  experimental: {
    // Tắt tính năng static generation cho các API routes
    serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
    // Tắt tính năng build traces để tránh lỗi Maximum call stack size exceeded
    disableOptimizedLoading: true,
    optimizeCss: false,
    // Tắt tính năng tree shaking để tránh lỗi Maximum call stack size exceeded
    turbotrace: {
      enabled: false,
    },
  },
  // Tắt tính năng webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Tắt tính năng tree shaking để tránh lỗi Maximum call stack size exceeded
    config.optimization.usedExports = false;
    
    return config;
  },
}

export default nextConfig
