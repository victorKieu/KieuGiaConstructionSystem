"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Các hàm action khác...

export async function deleteConstructionLog(id: string) {
  try {
    const { error } = await supabase.from("construction_logs").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting construction log:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa nhật ký xây dựng" }
  }
}

export async function createProject(projectData: any) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo dự án mới" }
  }
}

export async function createConstructionLog(logData: any) {
  try {
    const { data, error } = await supabase
      .from("construction_logs")
      .insert([
        {
          ...logData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/projects/${logData.project_id}`)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error creating construction log:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo nhật ký xây dựng mới" }
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa dự án" }
  }
}

export async function updateConstructionLog(id: string, logData: any) {
  try {
    const { data, error } = await supabase
      .from("construction_logs")
      .update({
        ...logData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/projects/${logData.project_id}`)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error updating construction log:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật nhật ký xây dựng" }
  }
}

export async function updateProject(id: string, projectData: any) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath("/dashboard/projects")
    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật dự án" }
  }
}
