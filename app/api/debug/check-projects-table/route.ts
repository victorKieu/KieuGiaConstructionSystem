import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Kiểm tra kết nối
    const { data: connectionTest, error: connectionError } = await supabase
      .from("projects")
      .select("count()", { count: "exact" })

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          error: connectionError.message,
          details: connectionError,
        },
        { status: 500 },
      )
    }

    // Lấy cấu trúc bảng
    const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_info", { table_name: "projects" })

    if (tableError) {
      return NextResponse.json(
        {
          success: false,
          error: tableError.message,
          details: tableError,
          connection: connectionTest,
        },
        { status: 500 },
      )
    }

    // Lấy mẫu dữ liệu
    const { data: sampleData, error: sampleError } = await supabase.from("projects").select("*").limit(5)

    return NextResponse.json({
      success: true,
      connection: connectionTest,
      tableInfo,
      sampleData,
      sampleError: sampleError ? sampleError.message : null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 },
    )
  }
}
