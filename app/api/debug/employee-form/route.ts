import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Lấy dữ liệu từ form
    const code = formData.get("code") as string
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const department = formData.get("department") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const hire_date = formData.get("hire_date") as string
    const status = (formData.get("status") as string) || "active"
    const notes = formData.get("notes") as string

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

    // Thêm nhân viên mới vào database
    const { data, error } = await supabase
      .from("employees")
      .insert({
        code,
        name,
        position,
        department,
        phone,
        email,
        address,
        hire_date,
        status,
        notes,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: `Không thể tạo nhân viên mới: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Lỗi khi tạo nhân viên mới: ${errorMessage}` }, { status: 500 })
  }
}
