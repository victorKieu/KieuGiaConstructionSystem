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
        // Vô hiệu hóa static generation
        unstable_disableStaticGeneration: true,
    },
}

export default nextConfig
