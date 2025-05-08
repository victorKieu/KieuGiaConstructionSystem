import { supabase } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Testing Supabase connection to employees table...")

    // Kiểm tra kết nối đến bảng employees
    const { data, error, count } = await supabase.from("employees").select("*", { count: "exact" }).limit(5)

    if (error) {
      console.error("Error connecting to employees table:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Không thể kết nối đến bảng employees",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối thành công đến bảng employees",
      count,
      sampleData: data,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi không xác định khi kết nối đến Supabase",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
