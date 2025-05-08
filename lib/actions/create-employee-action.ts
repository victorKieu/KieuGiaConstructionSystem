"use server"

import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createEmployeeAction(formData: FormData) {
  try {
    console.log("🚀 Server Action: Đang tạo nhân viên mới...")

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

    // Kiểm tra dữ liệu bắt buộc
    if (!name) throw new Error("Tên nhân viên là bắt buộc")
    if (!position) throw new Error("Chức vụ là bắt buộc")
    if (!department) throw new Error("Phòng ban là bắt buộc")
    if (!hire_date) throw new Error("Ngày vào làm là bắt buộc")

    // Tạo Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
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
      console.error("❌ Lỗi khi tạo nhân viên mới:", error)
      throw new Error(`Không thể tạo nhân viên mới: ${error.message}`)
    }

    console.log("✅ Server Action: Tạo nhân viên thành công:", data)

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error("❌ Server Action: Lỗi khi tạo nhân viên:", error)
    throw error
  }
}
