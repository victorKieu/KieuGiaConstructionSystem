import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("Testing Supabase connection to customers table...")

    const supabase = createServerSupabaseClient()

    // Kiểm tra kết nối đến bảng customers
    const { data, error, count } = await supabase.from("customers").select("*", { count: "exact" }).limit(5)

    if (error) {
      console.error("Error connecting to customers table:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Không thể kết nối đến bảng customers",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối thành công đến bảng customers",
      count,
      sampleData: data,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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
