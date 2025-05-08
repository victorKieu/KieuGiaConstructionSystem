"use server"

import { updateEmployee } from "./employee-actions"
import { redirect } from "next/navigation"

export async function updateEmployeeAction(id: string, formData: FormData) {
  try {
    console.log(`🚀 Server Action: Đang cập nhật nhân viên ID: ${id}`)
    const result = await updateEmployee(id, formData)
    console.log("✅ Server Action: Cập nhật nhân viên thành công:", result)

    // Chuyển hướng về trang chi tiết nhân viên
    redirect(`/dashboard/hrm/employees/${id}`)
  } catch (error) {
    console.error(`❌ Server Action: Lỗi khi cập nhật nhân viên ID ${id}:`, error)
    throw error
  }
}
