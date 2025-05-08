"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Định nghĩa kiểu dữ liệu cho nhân viên
export type Employee = {
  id?: string
  name: string
  position: string
  department: string
  phone?: string | null
  email?: string | null
  address?: string | null
  join_date: string
  status?: string
}

// Lấy danh sách nhân viên
export async function getEmployees() {
  try {
    const { data, error } = await supabase.from("employees").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching employees:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return []
  }
}

// Lấy chi tiết nhân viên theo ID
export async function getEmployeeById(id: string) {
  try {
    const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching employee:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch employee:", error)
    return null
  }
}

// Tạo nhân viên mới
export async function createEmployee(formData: FormData) {
  try {
    // Lấy dữ liệu từ form
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const department = formData.get("department") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const join_date = formData.get("join_date") as string
    const status = (formData.get("status") as string) || "Đang làm việc"

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !position || !department || !join_date) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
    }

    // Tạo nhân viên mới
    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          name,
          position,
          department,
          phone: phone || null,
          email: email || null,
          address: address || null,
          join_date,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating employee:", error)
      throw new Error("Không thể tạo nhân viên mới: " + error.message)
    }

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error("Failed to create employee:", error)
    throw error
  }
}

// Cập nhật thông tin nhân viên
export async function updateEmployee(id: string, formData: FormData) {
  try {
    // Lấy dữ liệu từ form
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const department = formData.get("department") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const join_date = formData.get("join_date") as string
    const status = formData.get("status") as string

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !position || !department || !join_date || !status) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
    }

    // Cập nhật thông tin nhân viên
    const { data, error } = await supabase
      .from("employees")
      .update({
        name,
        position,
        department,
        phone: phone || null,
        email: email || null,
        address: address || null,
        join_date,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating employee:", error)
      throw new Error("Không thể cập nhật thông tin nhân viên: " + error.message)
    }

    // Cập nhật lại dữ liệu
    revalidatePath(`/dashboard/hrm/employees/${id}`)
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang chi tiết nhân viên
    redirect(`/dashboard/hrm/employees/${id}`)
  } catch (error) {
    console.error("Failed to update employee:", error)
    throw error
  }
}

// Xóa nhân viên
export async function deleteEmployee(id: string) {
  try {
    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error("Error deleting employee:", error)
      throw new Error("Không thể xóa nhân viên: " + error.message)
    }

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error("Failed to delete employee:", error)
    throw error
  }
}

// Lấy danh sách phòng ban
export function getDepartments() {
  return [
    "Ban giám đốc",
    "Phòng kỹ thuật",
    "Phòng thi công",
    "Phòng thiết kế",
    "Phòng dự án",
    "Phòng kinh doanh",
    "Phòng tài chính kế toán",
    "Phòng hành chính nhân sự",
    "Phòng vật tư thiết bị",
  ]
}

// Lấy danh sách chức vụ
export function getPositions() {
  return [
    "Giám đốc",
    "Phó giám đốc",
    "Trưởng phòng",
    "Phó phòng",
    "Kỹ sư xây dựng",
    "Kỹ sư thiết kế",
    "Kiến trúc sư",
    "Giám sát công trình",
    "Chỉ huy trưởng",
    "Kế toán trưởng",
    "Kế toán viên",
    "Nhân viên kinh doanh",
    "Nhân viên hành chính",
    "Nhân viên vật tư",
    "Công nhân",
  ]
}

// Lấy danh sách trạng thái
export function getStatuses() {
  return ["Đang làm việc", "Nghỉ phép", "Nghỉ không lương", "Đã nghỉ việc"]
}
