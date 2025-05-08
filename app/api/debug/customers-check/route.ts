import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    // Kiểm tra kết nối đến Supabase
    const { data: customers, error } = await supabase.from("customers").select("*").limit(5)

    if (error) {
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

    // Kiểm tra cấu trúc bảng
    const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_info", {
      table_name: "customers",
    })

    if (tableError) {
      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy thông tin cấu trúc bảng customers",
          error: tableError.message,
          customers: customers,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối thành công đến bảng customers",
      customers: customers,
      tableInfo: tableInfo,
    })
  } catch (error) {
    console.error("Error in customers-check API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Đã xảy ra lỗi khi kiểm tra kết nối đến bảng customers",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
