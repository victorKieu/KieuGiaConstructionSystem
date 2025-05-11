import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Thử truy vấn một bảng không tồn tại để tạo lỗi
    const { data, error } = await supabase.from("non_existent_table").select("*")

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ success: false, error: "Lỗi không xác định khi kiểm tra lỗi" }, { status: 500 })
  }
}
