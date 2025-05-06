"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách nhân viên
export async function getEmployees() {
  const { data, error } = await supabase.from("employees").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching employees:", error)
    throw new Error("Không thể lấy danh sách nhân viên")
  }

  return data
}

// Lấy chi tiết nhân viên
export async function getEmployeeById(id: string) {
  const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching employee:", error)
    throw new Error("Không thể lấy thông tin nhân viên")
  }

  return data
}

// Tạo nhân viên mới
export async function createEmployee(employeeData: any) {
  const { data, error } = await supabase.from("employees").insert([employeeData]).select()

  if (error) {
    console.error("Error creating employee:", error)
    throw new Error("Không thể tạo nhân viên mới")
  }

  revalidatePath("/dashboard/hrm/employees")
  return data[0]
}

// Cập nhật nhân viên
export async function updateEmployee(id: string, employeeData: any) {
  const { data, error } = await supabase.from("employees").update(employeeData).eq("id", id).select()

  if (error) {
    console.error("Error updating employee:", error)
    throw new Error("Không thể cập nhật nhân viên")
  }

  revalidatePath(`/dashboard/hrm/employees/${id}`)
  revalidatePath("/dashboard/hrm/employees")
  return data[0]
}

// Xóa nhân viên
export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    console.error("Error deleting employee:", error)
    throw new Error("Không thể xóa nhân viên")
  }

  revalidatePath("/dashboard/hrm/employees")
  return { success: true }
}

// Lấy lịch sử chấm công của nhân viên
export async function getEmployeeAttendance(employeeId: string) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching employee attendance:", error)
    throw new Error("Không thể lấy lịch sử chấm công của nhân viên")
  }

  return data
}

// Lấy danh sách tài sản được giao cho nhân viên
export async function getEmployeeAssets(employeeId: string) {
  const { data, error } = await supabase
    .from("asset_assignments")
    .select("*, assets(name, type)")
    .eq("employee_id", employeeId)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching employee assets:", error)
    throw new Error("Không thể lấy danh sách tài sản được giao cho nhân viên")
  }

  return data
}

// Chấm công
export async function recordAttendance(attendanceData: any) {
  const { data, error } = await supabase.from("attendance").insert([attendanceData]).select()

  if (error) {
    console.error("Error recording attendance:", error)
    throw new Error("Không thể chấm công")
  }

  revalidatePath("/dashboard/hrm/attendance")
  return data[0]
}
