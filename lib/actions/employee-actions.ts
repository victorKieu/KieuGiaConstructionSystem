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
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// Định nghĩa kiểu dữ liệu cho thống kê nhân viên
export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  onLeaveEmployees: number
  terminatedEmployees: number
  newEmployees: number
  recentActivities: any[]
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

// Lấy thống kê nhân viên
export async function getEmployeeStats(): Promise<EmployeeStats> {
  try {
    console.log("🔍 Đang lấy thống kê nhân viên từ Supabase...")

    const supabase = createServerSupabaseClient()

    // Lấy tất cả nhân viên
    const { data: allEmployees, error: allError } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false })

    if (allError) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", allError)
      throw new Error(`Không thể lấy danh sách nhân viên: ${allError.message}`)
    }

    // Lấy nhân viên mới (trong 30 ngày gần đây)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()

    const { data: newEmployees, error: newError } = await supabase
      .from("employees")
      .select("*")
      .gte("created_at", thirtyDaysAgoStr)
      .order("created_at", { ascending: false })

    if (newError) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên mới:", newError)
      throw new Error(`Không thể lấy danh sách nhân viên mới: ${newError.message}`)
    }

    // Phân loại nhân viên theo trạng thái
    const activeEmployees = allEmployees.filter((emp) => emp.status === "active")
    const onLeaveEmployees = allEmployees.filter((emp) => emp.status === "on_leave")
    const terminatedEmployees = allEmployees.filter((emp) => emp.status === "terminated")

    // Tạo danh sách hoạt động gần đây (giả lập từ dữ liệu nhân viên)
    const recentActivities = newEmployees.slice(0, 5).map((emp) => ({
      id: emp.id,
      user: {
        name: emp.name,
        avatar: emp.avatar_url || "/abstract-geometric-shapes.png",
        initials: getInitials(emp.name),
      },
      action: "đã được thêm vào hệ thống",
      time: formatTimeAgo(new Date(emp.created_at || new Date())),
    }))

    // Thêm một số hoạt động khác nếu có nhân viên đã cập nhật gần đây
    const recentlyUpdated = allEmployees
      .filter((emp) => emp.updated_at && emp.updated_at !== emp.created_at)
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || 0)
        const dateB = new Date(b.updated_at || 0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 3)

    recentlyUpdated.forEach((emp) => {
      recentActivities.push({
        id: `${emp.id}-update`,
        user: {
          name: emp.name,
          avatar: emp.avatar_url || "/abstract-geometric-shapes.png",
          initials: getInitials(emp.name),
        },
        action: "đã cập nhật thông tin cá nhân",
        time: formatTimeAgo(new Date(emp.updated_at || new Date())),
      })
    })

    // Sắp xếp hoạt động theo thời gian
    recentActivities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time)
      const timeB = parseTimeAgo(b.time)
      return timeA - timeB
    })

    console.log(`✅ Đã lấy thống kê nhân viên: ${allEmployees.length} nhân viên`)

    return {
      totalEmployees: allEmployees.length,
      activeEmployees: activeEmployees.length,
      onLeaveEmployees: onLeaveEmployees.length,
      terminatedEmployees: terminatedEmployees.length,
      newEmployees: newEmployees.length,
      recentActivities: recentActivities.slice(0, 5), // Giới hạn 5 hoạt động
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy thống kê nhân viên:", error)
    throw error
  }
}

// Lấy danh sách nhân viên mới nhất
export async function getNewestEmployees(limit = 4): Promise<Employee[]> {
  try {
    console.log(`🔍 Đang lấy ${limit} nhân viên mới nhất từ Supabase...`)

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên mới nhất:", error)
      throw new Error(`Không thể lấy danh sách nhân viên mới nhất: ${error.message}`)
    }

    console.log(`✅ Đã lấy ${data?.length || 0} nhân viên mới nhất`)
    return data || []
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên mới nhất:", error)
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
    const avatar_url = formData.get("avatar_url") as string

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
      avatar_url,
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
        avatar_url,
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
    revalidatePath("/dashboard/hrm")

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
    const avatar_url = formData.get("avatar_url") as string

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
      avatar_url,
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

    console.log(`✅ Đã cập nhật thông tin nhân viên ID ${id}:`, data)

    // Cập nhật lại dữ liệu
    revalidatePath(`/dashboard/hrm/employees/${id}`)
    revalidatePath("/dashboard/hrm/employees")
    revalidatePath("/dashboard/hrm")

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
    revalidatePath("/dashboard/hrm")
  } catch (error) {
    console.error(`❌ Lỗi khi xóa nhân viên ID ${id}:`, error)
    throw error
  }
}

// Hàm tiện ích để lấy chữ cái đầu của họ và tên
function getInitials(name: string): string {
  if (!name) return "NA"

  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Hàm tiện ích để định dạng thời gian (ví dụ: "2 giờ trước")
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  return `${diffDays} ngày trước`
}

// Hàm tiện ích để phân tích chuỗi thời gian thành số mili giây
function parseTimeAgo(timeAgo: string): number {
  const match = timeAgo.match(/(\d+) (phút|giờ|ngày) trước/)
  if (!match) return 0

  const value = Number.parseInt(match[1])
  const unit = match[2]

  const now = new Date().getTime()
  if (unit === "phút") return now - value * 60 * 1000
  if (unit === "giờ") return now - value * 60 * 60 * 1000
  if (unit === "ngày") return now - value * 24 * 60 * 60 * 1000

  return 0
}
