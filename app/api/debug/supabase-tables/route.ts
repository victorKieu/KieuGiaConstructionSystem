import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Tạo Supabase client
    const supabase = createServerSupabaseClient()

    // Kiểm tra kết nối bằng cách lấy danh sách bảng
    const { data, error } = await supabase.from("customers").select("id, name").limit(5)

    if (error) {
      // Thử kiểm tra kết nối với bảng khác
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("id, name")
        .limit(5)

      if (employeesError) {
        // Kiểm tra xem có thể truy cập thông tin hệ thống không
        const { data: systemInfo, error: systemError } = await supabase.rpc("get_system_info")

        if (systemError) {
          return NextResponse.json(
            {
              success: false,
              message: "Không thể kết nối đến Supabase hoặc không có quyền truy cập",
              errors: {
                customers: error,
                employees: employeesError,
                system: systemError,
              },
              suggestion: "Kiểm tra biến môi trường SUPABASE_URL và SUPABASE_ANON_KEY",
            },
            { status: 500 },
          )
        }

        return NextResponse.json(
          {
            success: false,
            message: "Kết nối Supabase thành công nhưng không thể truy cập bảng",
            systemInfo,
            errors: {
              customers: error,
              employees: employeesError,
            },
            suggestion: "Kiểm tra quyền truy cập và tạo bảng nếu cần",
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: "Không thể truy cập bảng customers",
          error,
          employeesData,
          suggestion: "Bảng customers có thể chưa được tạo",
        },
        { status: 400 },
      )
    }

    // Trả về kết quả thành công
    return NextResponse.json({
      success: true,
      message: "Kết nối Supabase thành công",
      data: {
        customerCount: data?.length || 0,
        customers: data || [],
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server",
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Kiểm tra biến môi trường và kết nối mạng",
      },
      { status: 500 },
    )
  }
}
