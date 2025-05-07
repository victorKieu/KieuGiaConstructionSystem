"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = createClient()

  try {
    // Lấy tổng số dự án
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("id", { count: "exact" })

    if (projectsError) {
      console.error("Error fetching projects count:", projectsError)
      return { error: "Failed to fetch projects data" }
    }

    // Lấy tổng số khách hàng
    const { data: customersData, error: customersError } = await supabase
      .from("customers")
      .select("id", { count: "exact" })

    if (customersError) {
      console.error("Error fetching customers count:", customersError)
      return { error: "Failed to fetch customers data" }
    }

    // Lấy tổng số vật tư tồn kho
    const { data: inventoryData, error: inventoryError } = await supabase
      .from("inventory_items")
      .select("id", { count: "exact" })
      .gt("quantity", 0)

    if (inventoryError) {
      console.error("Error fetching inventory count:", inventoryError)
      return { error: "Failed to fetch inventory data" }
    }

    // Lấy vật tư sắp hết hàng
    const { data: lowStockItems, error: lowStockError } = await supabase
      .from("inventory_items")
      .select("*")
      .lt("quantity", "min_quantity")
      .order("quantity", { ascending: true })
      .limit(5)

    if (lowStockError) {
      console.error("Error fetching low stock items:", lowStockError)
      return { error: "Failed to fetch low stock items" }
    }

    // Lấy hoạt động gần đây
    const { data: recentActivities, error: activitiesError } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (activitiesError) {
      console.error("Error fetching recent activities:", activitiesError)
      return { error: "Failed to fetch recent activities" }
    }

    // Lấy dự án đang thực hiện
    const { data: activeProjects, error: activeProjectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "in_progress")
      .order("end_date", { ascending: true })
      .limit(5)

    if (activeProjectsError) {
      console.error("Error fetching active projects:", activeProjectsError)
      return { error: "Failed to fetch active projects" }
    }

    return {
      data: {
        projectsCount: projectsData.length,
        customersCount: customersData.length,
        inventoryCount: inventoryData.length,
        lowStockItems,
        recentActivities,
        activeProjects,
        recentActivitiesCount: recentActivities.length,
      },
    }
  } catch (error) {
    console.error("Exception in getDashboardStats:", error)
    return { error: "Failed to fetch dashboard statistics" }
  }
}
