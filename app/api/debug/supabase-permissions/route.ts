import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Tạo Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })

    // Kiểm tra kết nối và quyền truy cập
    const { data: tableInfo, error: tableError } = await supabase.from("employees").select("*").limit(1)

    // Thử thêm một bản ghi test
    const testData = {
      name: "Test User " + new Date().toISOString(),
      position: "Test Position",
      department: "Test Department",
      hire_date: new Date().toISOString().split("T")[0],
      status: "active",
    }

    const { data: insertData, error: insertError } = await supabase.from("employees").insert(testData).select().single()

    // Nếu thêm thành công, xóa bản ghi test
    let deleteResult = null
    let deleteError = null

    if (insertData) {
      const { data, error } = await supabase.from("employees").delete().eq("id", insertData.id)
      deleteResult = data
      deleteError = error
    }

    return NextResponse.json({
      success: true,
      connection: "OK",
      tableInfo: tableInfo ? "OK" : "Failed",
      tableError,
      insertTest: insertData ? "OK" : "Failed",
      insertError,
      deleteTest: deleteResult ? "OK" : "Failed",
      deleteError,
      testData,
      env: {
        supabaseUrl: supabaseUrl ? "Set" : "Missing",
        supabaseKey: supabaseKey ? "Set (length: " + supabaseKey.length + ")" : "Missing",
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Lỗi khi kiểm tra Supabase: ${errorMessage}` }, { status: 500 })
  }
}
