import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

// Lấy thống kê trạng thái dự án
export async function getProjectStatusStats() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

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
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

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
