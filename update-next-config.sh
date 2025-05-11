#!/bin/bash
# Script để cập nhật next.config.mjs

echo "Cập nhật next.config.mjs..."

# Tạo nội dung mới cho next.config.mjs
cat > "next.config.mjs" << 'EOF'
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
  
  // Vô hiệu hóa static generation cho toàn bộ dự án
  output: 'standalone',
  experimental: {
    // Các cấu hình experimental khác nếu có
  },
}

export default nextConfig
EOF

echo "Hoàn thành!"
