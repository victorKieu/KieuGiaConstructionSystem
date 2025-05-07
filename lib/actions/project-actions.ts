"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        customers(id, name),
        project_tasks(id),
        project_budgets(id, planned_amount, actual_amount)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Tính toán số lượng công việc cho mỗi dự án
    const projectsWithStats = data.map((project) => {
      return {
        ...project,
        task_count: project.project_tasks ? project.project_tasks.length : 0,
        budget:
          project.project_budgets && project.project_budgets.length > 0
            ? project.project_budgets.reduce((sum, budget) => sum + (budget.planned_amount || 0), 0)
            : 0,
        actual_cost:
          project.project_budgets && project.project_budgets.length > 0
            ? project.project_budgets.reduce((sum, budget) => sum + (budget.actual_amount || 0), 0)
            : 0,
      }
    })

    return { success: true, data: projectsWithStats }
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
        *,
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
    const { error } = await supabase
      .from("projects")
      .update({
        name: projectData.name,
        code: projectData.code,
        category: projectData.category,
        start_date: projectData.startDate.toISOString(),
        end_date: projectData.endDate.toISOString(),
        customer_id: projectData.customer,
        project_type: projectData.projectType,
        location: projectData.location,
        geo_code: projectData.geoCode,
        description: projectData.description,
        budget: projectData.budget,
        contact_name: projectData.contactName,
        contact_phone: projectData.contactPhone,
        contact_email: projectData.contactEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects pages
    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath("/dashboard/projects")

    return { success: true }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật dự án" }
  }
}

// Tạo dự án mới
export async function createProject(projectData: any) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: projectData.name,
          code: projectData.code,
          category: projectData.category,
          start_date: projectData.startDate.toISOString(),
          end_date: projectData.endDate.toISOString(),
          customer_id: projectData.customer,
          project_type: projectData.projectType,
          location: projectData.location,
          geo_code: projectData.geoCode,
          description: projectData.description,
          budget: projectData.budget,
          contact_name: projectData.contactName,
          contact_phone: projectData.contactPhone,
          contact_email: projectData.contactEmail,
          status: "planning", // Trạng thái mặc định khi tạo dự án mới
          health_status: "normal", // Tình trạng mặc định khi tạo dự án mới
          progress: 0, // Tiến độ mặc định khi tạo dự án mới
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects page
    revalidatePath("/dashboard/projects")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in createProject:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo dự án mới" }
  }
}

// Xóa dự án
export async function deleteProject(id: string) {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the projects page
    revalidatePath("/dashboard/projects")

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
    const { data, error } = await supabase.from("projects").select("status, count").order("status").group("status")

    if (error) {
      console.error("Error fetching project status stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const statusMap = {
      planning: "Kế hoạch",
      "in-progress": "Đang làm",
      "on-hold": "Tạm dừng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }

    const statusColors = {
      planning: "#3498db",
      "in-progress": "#2ecc71",
      "on-hold": "#f39c12",
      completed: "#1abc9c",
      cancelled: "#e74c3c",
    }

    const formattedData = data.map((item) => ({
      status: statusMap[item.status] || item.status,
      count: item.count,
      color: statusColors[item.status] || "#95a5a6",
    }))

    return { success: true, data: formattedData }
  } catch (error) {
    console.error("Error in getProjectStatusStats:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thống kê trạng thái dự án", data: [] }
  }
}

// Lấy thống kê tình trạng dự án
export async function getProjectHealthStats() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("health_status, count")
      .order("health_status")
      .group("health_status")

    if (error) {
      console.error("Error fetching project health stats:", error)
      return { success: false, error: error.message, data: [] }
    }

    // Chuyển đổi dữ liệu thành định dạng phù hợp
    const healthMap = {
      normal: "Bình thường",
      accelerated: "Tăng tốc",
      delayed: "Lùi ý",
      "at-risk": "Rủi ro",
      critical: "Chậm trễ",
    }

    const healthColors = {
      normal: "#3498db",
      accelerated: "#2ecc71",
      delayed: "#f39c12",
      "at-risk": "#e74c3c",
      critical: "#9b59b6",
    }

    const formattedData = data.map((item) => ({
      status: healthMap[item.health_status] || item.health_status,
      count: item.count,
      color: healthColors[item.health_status] || "#95a5a6",
    }))

    return { success: true, data: formattedData }
  } catch (error) {
    console.error("Error in getProjectHealthStats:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thống kê tình trạng dự án", data: [] }
  }
}
