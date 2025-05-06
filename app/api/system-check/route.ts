import { NextResponse } from "next/server"

export async function GET() {
  // Kiểm tra các thành phần hệ thống
  const systemInfo = {
    // Thông tin Node.js
    node: process.version,
    // Thông tin hệ điều hành
    platform: process.platform,
    arch: process.arch,
    // Thông tin môi trường
    env: process.env.NODE_ENV || "development",
    // Thông tin Vercel
    vercel: process.env.VERCEL ? "Đang chạy trên Vercel" : "Không chạy trên Vercel",
    vercelEnv: process.env.VERCEL_ENV || "Không xác định",
    // Thông tin thời gian
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  // Trả về thông tin dưới dạng JSON
  return NextResponse.json({
    status: "success",
    system: systemInfo,
  })
}
