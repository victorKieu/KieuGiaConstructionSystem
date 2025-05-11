import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Tạo client Supabase
    const supabase = createServerSupabaseClient()

    // Kiểm tra kết nối bằng cách thực hiện một truy vấn đơn giản
    const { data, error } = await supabase.from("projects").select("count").single()

    if (error) {
      console.error("Lỗi kết nối Supabase:", error.message)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Đã cấu hình" : "Chưa cấu hình",
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Đã cấu hình" : "Chưa cấu hình",
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối Supabase thành công",
      data,
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Đã cấu hình" : "Chưa cấu hình",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Đã cấu hình" : "Chưa cấu hình",
      },
    })
  } catch (error) {
    console.error("Lỗi kiểm tra kết nối Supabase:", error)
    return NextResponse.json({
      success: false,
      error: "Lỗi không xác định khi kiểm tra kết nối Supabase",
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Đã cấu hình" : "Chưa cấu hình",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Đã cấu hình" : "Chưa cấu hình",
      },
    })
  }
}
