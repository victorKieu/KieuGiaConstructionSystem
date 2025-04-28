import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Kiểm tra các biến môi trường cần thiết
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.substring(0, 15)}...` // Chỉ hiển thị một phần để bảo mật
        : undefined,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Kiểm tra xem DATABASE_URL có tồn tại không
    const missingVars = Object.entries(envVars)
      .filter(([_, value]) => value === undefined)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return NextResponse.json({
        status: "warning",
        message: "Thiếu biến môi trường",
        missingVars,
        envVars,
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Tất cả biến môi trường đã được cấu hình",
      envVars,
    })
  } catch (error) {
    console.error("API: Lỗi khi kiểm tra biến môi trường:", error)

    return NextResponse.json({
      status: "error",
      message: "Lỗi khi kiểm tra biến môi trường",
      error: String(error),
    })
  }
}
