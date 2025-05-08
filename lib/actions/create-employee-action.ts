"use server"

import { createEmployee } from "./employee-actions"
import { redirect } from "next/navigation"

export async function createEmployeeAction(formData: FormData) {
  try {
    console.log("🚀 Server Action: Đang tạo nhân viên mới...")
    const result = await createEmployee(formData)
    console.log("✅ Server Action: Tạo nhân viên thành công:", result)

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error("❌ Server Action: Lỗi khi tạo nhân viên:", error)
    throw error
  }
}
