"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  try {
    console.log("Fetching projects from Supabase...")

    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        code,
        name,
        description,
        location,
        start_date,
        end_date,
        budget,
        status,
        progress,
        project_type,
        construction_type,
        project_manager,
        complexity,
        priority,
        risk_level,
        customer_id,
        created_at,
        updated_at,
        customers(id, name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log(`Successfully fetched ${data.length} projects`)
    return { success: true, data }
  } catch (error) {
    console.error("Error in getProjects:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án", data: [] }
  }
}

// Lấy chi tiết dự án theo ID
export async function getProjectById(id: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        code,
        name,
        description,
        location,
        start_date,
        end_date,
        budget,
        status,
        progress,
        project_type,
        construction_type,
        project_manager,
        complexity,
        priority,
        risk_level,
        customer_id,
        created_at,
        updated_at,
        customers(id, name)
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

// Cập nhật dự án
export async function updateProject(id: string, projectData: any) {
  try {
    console.log("Updating project with ID:", id)
    console.log("Project data:", projectData)

    // Chuyển đổi ngày từ Date object sang ISO string nếu cần
    const formattedData = {
      ...projectData,
      start_date:
        projectData.start_date instanceof Date ? projectData.start_date.toISOString() : projectData.start_date,
      end_date: projectData.end_date instanceof Date ? projectData.end_date.toISOString() : projectData.end_date,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("projects").update(formattedData).eq("id", id)

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects pages
    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/overview")

    return { success: true }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật dự án" }
  }
}

// Tạo dự án mới
export async function createProject(projectData: any) {
  try {
    console.log("Creating new project with data:", projectData)

    // Tạo mã dự án tự động dựa trên loại dự án
    const currentYear = new Date().getFullYear().toString().slice(-2)
    let prefix = "PRJ"

    switch (projectData.construction_type) {
      case "residential":
        prefix = "RES"
        break
      case "commercial":
        prefix = "COM"
        break
      case "industrial":
        prefix = "IND"
        break
      case "infrastructure":
        prefix = "INF"
        break
      case "townhouse":
        prefix = "TWN"
        break
      default:
        prefix = "PRJ"
    }

    // Lấy số dự án hiện tại để tạo mã mới
    const { data: existingProjects, error: countError } = await supabase
      .from("projects")
      .select("code")
      .ilike("code", `${prefix}%`)

    if (countError) {
      console.error("Error counting projects:", countError)
      return { success: false, error: countError.message }
    }

    const projectCount = existingProjects ? existingProjects.length + 1 : 1
    const sequenceNumber = projectCount.toString().padStart(3, "0")

    const projectCode = `${prefix}${sequenceNumber}`

    // Chuyển đổi ngày từ Date object sang ISO string
    const formattedData = {
      name: projectData.name,
      code: projectCode,
      description: projectData.description || null,
      location: projectData.location || null,
      start_date:
        projectData.start_date instanceof Date ? projectData.start_date.toISOString() : projectData.start_date,
      end_date: projectData.end_date instanceof Date ? projectData.end_date.toISOString() : projectData.end_date,
      budget: projectData.budget || 0,
      status: projectData.status || "planning",
      progress: projectData.progress || 0,
      project_type: projectData.project_type || null,
      construction_type: projectData.construction_type || null,
      project_manager: projectData.project_manager || null,
      complexity: projectData.complexity || "medium",
      priority: projectData.priority || "normal",
      risk_level: projectData.risk_level || "low",
      customer_id: projectData.customer_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("projects").insert([formattedData]).select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects page
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/overview")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in createProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo dự án mới" }
  }
}

// Xóa dự án
export async function deleteProject(id: string) {
  try {
    console.log("Deleting project with ID:", id)

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects page
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/overview")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa dự án" }
  }
}

// Lấy danh sách khách hàng cho dropdown
export async function getCustomers() {
  try {
    const { data, error } = await supabase.from("customers").select("id, name").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching customers:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomers:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách khách hàng", data: [] }
  }
}

// Lấy thống kê trạng thái dự án
export async function getProjectStatusStats() {
  try {
    const { data, error } = await supabase.from("projects").select("status")

    if (error) {
      console.error("Error fetching project status stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Đếm số lượng dự án theo trạng thái
    const statusCounts = data.reduce((acc, project) => {
      const status = project.status || "unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const statusMap = {
      planning: "Kế hoạch",
      in_progress: "Đang làm",
      on_hold: "Tạm dừng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }

    const statusColors = {
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
    const { data, error } = await supabase.from("projects").select("project_type")

    if (error) {
      console.error("Error fetching project type stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Đếm số lượng dự án theo loại
    const typeCounts = data.reduce((acc, project) => {
      const type = project.project_type || "unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const typeMap = {
      residential: "Nhà ở",
      commercial: "Thương mại",
      industrial: "Công nghiệp",
      infrastructure: "Hạ tầng",
    }

    const typeColors = {
      residential: "#3498db",
      commercial: "#2ecc71",
      industrial: "#f39c12",
      infrastructure: "#9b59b6",
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
