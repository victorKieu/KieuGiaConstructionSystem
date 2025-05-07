import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Thông tin cơ bản về môi trường
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Đã cấu hình" : "Chưa cấu hình",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Đã cấu hình" : "Chưa cấu hình",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Đã cấu hình" : "Chưa cấu hình",
    }

    // Kiểm tra kết nối Supabase
    let dbStatus = "Chưa kiểm tra"
    let dbError = null
    let dbData = null

    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("customers").select("id, name").limit(1)

      if (error) {
        dbStatus = "Lỗi kết nối"
        dbError = error
      } else {
        dbStatus = "Kết nối thành công"
        dbData = data
      }
    } catch (error: any) {
      dbStatus = "Lỗi exception"
      dbError = {
        message: error.message,
        stack: error.stack,
      }
    }

    // Kiểm tra middleware
    const middlewareInfo = {
      isEnabled: true,
      matcher: ["/api/:path*"],
    }

    // Thông tin về runtime
    const runtimeInfo = {
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
    }

    return NextResponse.json({
      status: "success",
      environment: envInfo,
      database: {
        status: dbStatus,
        error: dbError,
        data: dbData,
      },
      middleware: middlewareInfo,
      runtime: runtimeInfo,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Lỗi khi chạy debug API",
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 },
    )
  }
}
