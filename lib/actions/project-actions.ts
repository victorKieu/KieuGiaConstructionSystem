"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getProjects:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án", data: [] }
  }
}

// Lấy chi tiết dự án theo ID
export async function getProjectById(id: string) {
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

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
        start_date: projectData.startDate.toISOString(),
        end_date: projectData.endDate.toISOString(),
        customer: projectData.customer,
        project_type: projectData.projectType,
        location: projectData.location,
        description: projectData.description,
        budget: projectData.budget,
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
          start_date: projectData.startDate.toISOString(),
          end_date: projectData.endDate.toISOString(),
          customer: projectData.customer,
          project_type: projectData.projectType,
          location: projectData.location,
          description: projectData.description,
          budget: projectData.budget,
          status: "planning", // Trạng thái mặc định khi tạo dự án mới
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
