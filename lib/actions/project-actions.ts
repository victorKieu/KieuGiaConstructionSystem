"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  try {
    const supabase = createServerSupabaseClient()

    // Lấy dữ liệu dự án từ bảng projects
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        customers:customer_id (
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getProjects:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án" }
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

    revalidatePath("/dashboard/projectlist")
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

    revalidatePath("/dashboard/projectlist")
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

    revalidatePath("/dashboard/projectlist")
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
