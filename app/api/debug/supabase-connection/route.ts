import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Tạo Supabase client
    const supabase = createServerSupabaseClient()

    // Kiểm tra kết nối bằng cách lấy danh sách bảng
    const { data, error } = await supabase.from("employees").select("id, name").limit(5)

    if (error) {
      console.error("Supabase connection error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Không thể kết nối đến Supabase",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    // Trả về kết quả thành công
    return NextResponse.json({
      success: true,
      message: "Kết nối Supabase thành công",
      data: {
        employeeCount: data?.length || 0,
        employees: data || [],
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
