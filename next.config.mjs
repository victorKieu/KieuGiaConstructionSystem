/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Thêm cấu hình webpack để xử lý lỗi ESM URL Scheme
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Đảm bảo webpack không cố gắng giải quyết các đường dẫn tuyệt đối
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}

export default nextConfig
