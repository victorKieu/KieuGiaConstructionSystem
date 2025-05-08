"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Định nghĩa kiểu dữ liệu cho nhân viên
export interface Employee {
  id: string
  code?: string
  name: string
  position: string
  department: string
  phone?: string
  email?: string
  address?: string
  hire_date: string | Date
  status?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

// Hàm tạo Supabase client
function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Lấy danh sách nhân viên
export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log("🔍 Đang lấy danh sách nhân viên từ Supabase...")

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error)
      throw new Error(`Không thể lấy danh sách nhân viên: ${error.message}`)
    }

    console.log(`✅ Đã lấy ${data?.length || 0} nhân viên`)
    return data || []
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên:", error)
    throw error
  }
}

// Lấy thông tin nhân viên theo ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    console.log(`🔍 Đang lấy thông tin nhân viên với ID: ${id}`)

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log(`❓ Không tìm thấy nhân viên với ID: ${id}`)
        return null
      }

      console.error(`❌ Lỗi khi lấy thông tin nhân viên ID ${id}:`, error)
      throw new Error(`Không thể lấy thông tin nhân viên: ${error.message}`)
    }

    console.log(`✅ Đã lấy thông tin nhân viên: ${data.name}`)
    return data
  } catch (error) {
    console.error(`❌ Lỗi khi lấy thông tin nhân viên ID ${id}:`, error)
    throw error
  }
}

// Tạo nhân viên mới
export async function createEmployee(formData: FormData): Promise<Employee> {
  try {
    console.log("📝 Đang tạo nhân viên mới...")

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

    console.log("📋 Dữ liệu nhân viên mới:", {
      code,
      name,
      position,
      department,
      hire_date,
      status,
    })

    const supabase = createServerSupabaseClient()

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

    console.log("✅ Đã tạo nhân viên mới:", data)

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")

    return data
  } catch (error) {
    console.error("❌ Lỗi khi tạo nhân viên mới:", error)
    throw error
  }
}

// Cập nhật thông tin nhân viên
export async function updateEmployee(id: string, formData: FormData): Promise<Employee> {
  try {
    console.log(`📝 Đang cập nhật thông tin nhân viên ID: ${id}`)

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

    // Kiểm tra dữ liệu bắt buộc
    if (!name) throw new Error("Tên nhân viên là bắt buộc")
    if (!position) throw new Error("Chức vụ là bắt buộc")
    if (!department) throw new Error("Phòng ban là bắt buộc")
    if (!hire_date) throw new Error("Ngày vào làm là bắt buộc")

    console.log("📋 Dữ liệu cập nhật:", {
      code,
      name,
      position,
      department,
      hire_date,
      status,
    })

    const supabase = createServerSupabaseClient()

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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`❌ Lỗi khi cập nhật nhân viên ID ${id}:`, error)
      throw new Error(`Không thể cập nhật thông tin nhân viên: ${error.message}`)
    }

    console.log(`✅ Đã cập nhật thông tin nhân viên ID ${id}:`, data)

    // Cập nhật lại dữ liệu
    revalidatePath(`/dashboard/hrm/employees/${id}`)
    revalidatePath("/dashboard/hrm/employees")

    return data
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật nhân viên ID ${id}:`, error)
    throw error
  }
}

// Xóa nhân viên
export async function deleteEmployee(id: string): Promise<void> {
  try {
    console.log(`🗑️ Đang xóa nhân viên ID: ${id}`)

    const supabase = createServerSupabaseClient()

    // Xóa nhân viên từ database
    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error(`❌ Lỗi khi xóa nhân viên ID ${id}:`, error)
      throw new Error(`Không thể xóa nhân viên: ${error.message}`)
    }

    console.log(`✅ Đã xóa nhân viên ID ${id}`)

    // Cập nhật lại dữ liệu
    revalidatePath("/dashboard/hrm/employees")
  } catch (error) {
    console.error(`❌ Lỗi khi xóa nhân viên ID ${id}:`, error)
    throw error
  }
}
