"use server"

import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateEmployeeAction(formData: FormData) {
  try {
    const id = formData.get("id") as string

    if (!id) {
      throw new Error("ID nhân viên không hợp lệ")
    }

    console.log(`🚀 Server Action: Đang cập nhật nhân viên ID: ${id}`)

    // Lấy dữ liệu từ form
    const code = formData.get("code") as string
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const department = formData.get("department") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const hire_date = formData.get("hire_date") as string
    const status = formData.get("status") as string
    const notes = formData.get("notes") as string
    const avatar_url = formData.get("avatar_url") as string

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

    // Cập nhật thông tin nhân viên
    const { data, error } = await supabase
      .from("employees")
      .update({
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
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`❌ Lỗi khi cập nhật nhân viên ID ${id}:`, error)
      throw new Error(`Không thể cập nhật thông tin nhân viên: ${error.message}`)
    }

    console.log("✅ Server Action: Cập nhật nhân viên thành công:", data)

    // Cập nhật lại dữ liệu
    revalidatePath(`/dashboard/hrm/employees/${id}`)
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang chi tiết nhân viên
    redirect(`/dashboard/hrm/employees/${id}`)
  } catch (error) {
    console.error("❌ Server Action: Lỗi khi cập nhật nhân viên:", error)
    throw error
  }
}
