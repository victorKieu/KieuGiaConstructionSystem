import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Thử truy vấn một bảng không tồn tại để tạo lỗi
    const { data, error } = await supabase.from("runtime_test").select("*")

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Runtime error:", error)
    return NextResponse.json(
      { success: false, error: "Lỗi runtime: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
