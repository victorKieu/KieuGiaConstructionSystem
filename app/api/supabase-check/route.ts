import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function GET() {
  try {
    // Sử dụng createClient thay vì testSupabaseConnection
    const supabase = createClient()
    const { data, error } = await supabase.from("test").select("*").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Lỗi kết nối: ${error.message}`,
          error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Kết nối thành công",
      data,
    })
  } catch (error) {
    console.error("Error in supabase-check API:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi không xác định: ${error instanceof Error ? error.message : String(error)}`,
        error,
      },
      { status: 500 },
    )
  }
}
