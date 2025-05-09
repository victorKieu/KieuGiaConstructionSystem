"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  try {
    console.log("Bắt đầu lấy danh sách dự án từ Supabase...")

    // Tạo Supabase client
    const supabase = createServerSupabaseClient()

    console.log("Đã tạo Supabase client, đang truy vấn dữ liệu...")

    // Kiểm tra kết nối Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from("projects")
      .select("count()", { count: "exact" })

    if (connectionError) {
      console.error("Lỗi kết nối Supabase:", connectionError)
      return { success: false, error: `Lỗi kết nối Supabase: ${connectionError.message}`, data: [] }
    }

    console.log("Kết nối Supabase thành công, số lượng dự án:", connectionTest)

    // Lấy dữ liệu dự án từ bảng projects
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        customers:customer_id (
          id, name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Lỗi khi lấy danh sách dự án:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log(`Đã lấy thành công ${data?.length || 0} dự án:`, data)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Lỗi trong hàm getProjects:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án", data: [] }
  }
}

// Lấy thông tin dự án theo ID
export async function getProjectById(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        customers:customer_id (
          name
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching project:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getProjectById:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thông tin dự án" }
  }
}

// Lấy danh sách khách hàng
export async function getCustomers() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("customers").select("id, name, code").order("name")

    if (error) {
      console.error("Error fetching customers:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomers:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách khách hàng" }
  }
}

// Tạo dự án mới
export async function createProject(projectData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Tạo mã dự án tự động
    const prefix = getProjectCodePrefix(projectData.construction_type)
    const { data: lastProject, error: countError } = await supabase
      .from("projects")
      .select("code")
      .ilike("code", `${prefix}%`)
      .order("code", { ascending: false })
      .limit(1)

    let newCode = `${prefix}001`

    if (!countError && lastProject && lastProject.length > 0) {
      const lastCode = lastProject[0].code
      const lastNumber = Number.parseInt(lastCode.replace(prefix, ""))
      newCode = `${prefix}${(lastNumber + 1).toString().padStart(3, "0")}`
    }

    // Thêm dự án mới
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        code: newCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects/list")
    return { success: true, data }
  } catch (error) {
    console.error("Error in createProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo dự án" }
  }
}

// Cập nhật dự án
export async function updateProject(id: string, projectData: any) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects/list")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật dự án" }
  }
}

// Xóa dự án
export async function deleteProject(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects/list")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa dự án" }
  }
}

// Hàm tạo prefix cho mã dự án
function getProjectCodePrefix(constructionType: string) {
  const prefixMap: Record<string, string> = {
    townhouse: "TH",
    residential: "RS",
    commercial: "CM",
    industrial: "IN",
    infrastructure: "IF",
  }

  return prefixMap[constructionType] || "PR"
}

// Lấy thống kê trạng thái dự án
export async function getProjectStatusStats() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("projects").select("status")

    if (error) {
      console.error("Error fetching project status stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Đếm số lượng dự án theo trạng thái
    const statusCounts = data.reduce((acc: Record<string, number>, project) => {
      const status = project.status || "unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const statusMap: Record<string, string> = {
      planning: "Kế hoạch",
      in_progress: "Đang thực hiện",
      on_hold: "Tạm dừng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }

    const statusColors: Record<string, string> = {
      planning: "#3498db",
      in_progress: "#2ecc71",
      on_hold: "#f39c12",
      completed: "#1abc9c",
      cancelled: "#e74c3c",
    }

    const formattedData = Object.entries(statusCounts).map(([status, count]) => ({
      status: statusMap[status] || status,
      count,
      color: statusColors[status] || "#95a5a6",
    }))

    return { success: true, data: formattedData }
  } catch (error) {
    console.error("Error in getProjectStatusStats:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thống kê trạng thái dự án", data: [] }
  }
}

// Lấy thống kê loại dự án
export async function getProjectTypeStats() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("projects").select("project_type, construction_type")

    if (error) {
      console.error("Error fetching project type stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Đếm số lượng dự án theo loại xây dựng
    const typeCounts = data.reduce((acc: Record<string, number>, project) => {
      const type = project.construction_type || "unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const typeMap: Record<string, string> = {
      residential: "Nhà ở",
      commercial: "Thương mại",
      industrial: "Công nghiệp",
      infrastructure: "Hạ tầng",
      townhouse: "Nhà phố",
    }

    const typeColors: Record<string, string> = {
      residential: "#3498db",
      commercial: "#2ecc71",
      industrial: "#f39c12",
      infrastructure: "#9b59b6",
      townhouse: "#e74c3c",
    }

    const formattedData = Object.entries(typeCounts).map(([type, count]) => ({
      type: typeMap[type] || type,
      count,
      color: typeColors[type] || "#95a5a6",
    }))

    return { success: true, data: formattedData }
  } catch (error) {
    console.error("Error in getProjectTypeStats:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thống kê loại dự án", data: [] }
  }
}
