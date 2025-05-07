/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình cơ bản
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Tắt tính năng tạo trang tĩnh
  output: 'standalone',
  
  // Cấu hình image domains
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    unoptimized: true,
  },
  
  // Cấu hình experimental
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  
  // Cấu hình webpack
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
}

export default nextConfig
