import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Kiểm tra các biến môi trường
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "Thiếu biến môi trường Supabase",
          env: {
            supabaseUrl: supabaseUrl ? "Đã cấu hình" : "Chưa cấu hình",
            supabaseAnonKey: supabaseAnonKey ? "Đã cấu hình" : "Chưa cấu hình",
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "Biến môi trường Supabase đã được cấu hình",
      env: {
        supabaseUrl: "Đã cấu hình",
        supabaseAnonKey: "Đã cấu hình",
      },
    })
  } catch (error) {
    console.error("Supabase status check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Lỗi kiểm tra trạng thái Supabase",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
