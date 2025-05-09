import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Thay thế hàm testSupabaseConnection bằng kiểm tra kết nối trực tiếp
    const supabase = createClient()
    const { data, error } = await supabase.from("customers").select("count()", { count: "exact" }).limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Supabase connection successful", data })
  } catch (error) {
    console.error("Error in supabase-check API:", error)
    return NextResponse.json({ success: false, error: "Unexpected error in API route" }, { status: 500 })
  }
}
