import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    // Kiểm tra kết nối đến bảng projects
    const { data, error } = await supabase.from("projects").select("*").limit(5)

    if (error) {
      console.error("Error connecting to projects table:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    // Kiểm tra cấu trúc bảng
    const { data: tableInfo, error: tableError } = await supabase
      .rpc("get_table_info", { table_name: "projects" })
      .select("*")

    return NextResponse.json({
      success: true,
      message: "Kết nối đến bảng projects thành công",
      sampleData: data,
      tableInfo: tableInfo || "Không thể lấy thông tin cấu trúc bảng",
      tableInfoError: tableError,
    })
  } catch (error) {
    console.error("Exception when checking projects table:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi kiểm tra kết nối đến bảng projects",
        details: error,
      },
      { status: 500 },
    )
  }
}
