"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Định nghĩa kiểu dữ liệu cho nhân viên theo schema thực tế
export type Employee = {
  id?: string
  code?: string
  name: string
  position: string
  department: string
  phone?: string | null
  email?: string | null
  address?: string | null
  hire_date: string
  birth_date?: string | null
  gender?: string | null
  id_number?: string | null
  tax_code?: string | null
  bank_account?: string | null
  bank_name?: string | null
  emergency_contact?: string | null
  emergency_phone?: string | null
  status?: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

// Lấy danh sách nhân viên
export async function getEmployees() {
  console.log("🔍 Bắt đầu lấy danh sách nhân viên...")

  try {
    const supabase = createServerSupabaseClient()
    console.log("✅ Đã tạo Supabase client (server)")

    const { data, error, count } = await supabase
      .from("employees")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })

    if (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error)
      return []
    }

    console.log(`✅ Đã lấy ${count || 0} nhân viên thành công`)
    return data || []
  } catch (error) {
    console.error("❌ Lỗi không xác định khi lấy danh sách nhân viên:", error)
    return []
  }
}

// Lấy chi tiết nhân viên theo ID
export async function getEmployeeById(id: string) {
  console.log(`🔍 Bắt đầu lấy thông tin nhân viên ID: ${id}`)

  try {
    const supabase = createServerSupabaseClient()
    console.log("✅ Đã tạo Supabase client (server)")

    const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

    if (error) {
      console.error(`❌ Lỗi khi lấy thông tin nhân viên ID ${id}:`, error)
      return null
    }

    console.log(`✅ Đã lấy thông tin nhân viên ID ${id} thành công`)
    return data
  } catch (error) {
    console.error(`❌ Lỗi không xác định khi lấy thông tin nhân viên ID ${id}:`, error)
    return null
  }
}

// Tạo nhân viên mới
export async function createEmployee(formData: FormData) {
  console.log("🔍 Bắt đầu tạo nhân viên mới...")

  try {
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

    console.log("📋 Dữ liệu form:", { code, name, position, department, hire_date, status })

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !position || !department || !hire_date) {
      console.error("❌ Thiếu thông tin bắt buộc")
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
    }

    const supabase = createServerSupabaseClient()
    console.log("✅ Đã tạo Supabase client (server)")

    // Tạo nhân viên mới
    const employeeData = {
      code: code || null,
      name,
      position,
      department,
      phone: phone || null,
      email: email || null,
      address: address || null,
      hire_date,
      status,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("📋 Dữ liệu sẽ insert:", employeeData)

    const { data, error } = await supabase.from("employees").insert([employeeData]).select()

    if (error) {
      console.error("❌ Lỗi khi tạo nhân viên mới:", error)
      throw new Error("Không thể tạo nhân viên mới: " + error.message)
    }

    console.log("✅ Đã tạo nhân viên mới thành công:", data)

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error("❌ Lỗi không xác định khi tạo nhân viên mới:", error)
    throw error
  }
}

// Cập nhật thông tin nhân viên
export async function updateEmployee(id: string, formData: FormData) {
  console.log(`🔍 Bắt đầu cập nhật thông tin nhân viên ID: ${id}`)

  try {
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

    console.log("📋 Dữ liệu form:", { code, name, position, department, hire_date, status })

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !position || !department || !hire_date || !status) {
      console.error("❌ Thiếu thông tin bắt buộc")
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
    }

    const supabase = createServerSupabaseClient()
    console.log("✅ Đã tạo Supabase client (server)")

    // Cập nhật thông tin nhân viên
    const employeeData = {
      code: code || null,
      name,
      position,
      department,
      phone: phone || null,
      email: email || null,
      address: address || null,
      hire_date,
      status,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    console.log("📋 Dữ liệu sẽ update:", employeeData)

    const { data, error } = await supabase.from("employees").update(employeeData).eq("id", id).select()

    if (error) {
      console.error(`❌ Lỗi khi cập nhật thông tin nhân viên ID ${id}:`, error)
      throw new Error("Không thể cập nhật thông tin nhân viên: " + error.message)
    }

    console.log(`✅ Đã cập nhật thông tin nhân viên ID ${id} thành công:`, data)

    // Cập nhật lại dữ liệu
    revalidatePath(`/dashboard/hrm/employees/${id}`)
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang chi tiết nhân viên
    redirect(`/dashboard/hrm/employees/${id}`)
  } catch (error) {
    console.error(`❌ Lỗi không xác định khi cập nhật thông tin nhân viên ID ${id}:`, error)
    throw error
  }
}

// Xóa nhân viên
export async function deleteEmployee(id: string) {
  console.log(`🔍 Bắt đầu xóa nhân viên ID: ${id}`)

  try {
    const supabase = createServerSupabaseClient()
    console.log("✅ Đã tạo Supabase client (server)")

    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error(`❌ Lỗi khi xóa nhân viên ID ${id}:`, error)
      throw new Error("Không thể xóa nhân viên: " + error.message)
    }

    console.log(`✅ Đã xóa nhân viên ID ${id} thành công`)

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    // Chuyển hướng về trang danh sách nhân viên
    redirect("/dashboard/hrm/employees")
  } catch (error) {
    console.error(`❌ Lỗi không xác định khi xóa nhân viên ID ${id}:`, error)
    throw error
  }
}
