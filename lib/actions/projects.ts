"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách dự án
export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*, customers(name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Không thể lấy danh sách dự án")
  }

  return data
}

// Lấy chi tiết dự án
export async function getProjectById(id: string) {
  const { data, error } = await supabase.from("projects").select("*, customers(name)").eq("id", id).single()

  if (error) {
    console.error("Error fetching project:", error)
    throw new Error("Không thể lấy thông tin dự án")
  }

  return data
}

// Tạo dự án mới
export async function createProject(projectData: any) {
  const { data, error } = await supabase.from("projects").insert([projectData]).select()

  if (error) {
    console.error("Error creating project:", error)
    throw new Error("Không thể tạo dự án mới")
  }

  revalidatePath("/dashboard/projects")
  return data[0]
}

// Cập nhật dự án
export async function updateProject(id: string, projectData: any) {
  const { data, error } = await supabase.from("projects").update(projectData).eq("id", id).select()

  if (error) {
    console.error("Error updating project:", error)
    throw new Error("Không thể cập nhật dự án")
  }

  revalidatePath(`/dashboard/projects/${id}`)
  revalidatePath("/dashboard/projects")
  return data[0]
}

// Xóa dự án
export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    throw new Error("Không thể xóa dự án")
  }

  revalidatePath("/dashboard/projects")
  return { success: true }
}

// Lấy tiến độ dự án
export async function getProjectTimeline(id: string) {
  const { data, error } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", id)
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching project timeline:", error)
    throw new Error("Không thể lấy tiến độ dự án")
  }

  return data
}

// Lấy danh sách vấn đề dự án
export async function getProjectIssues(id: string) {
  const { data, error } = await supabase
    .from("project_issues")
    .select("*, employees!reported_by(name), employees!assigned_to(name)")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching project issues:", error)
    throw new Error("Không thể lấy danh sách vấn đề dự án")
  }

  return data
}

// Lấy thông tin tài chính dự án
export async function getProjectFinance(id: string) {
  const { data, error } = await supabase.from("project_finances").select("*").eq("project_id", id).single()

  if (error) {
    console.error("Error fetching project finance:", error)
    throw new Error("Không thể lấy thông tin tài chính dự án")
  }

  return data
}

// Lấy danh sách nhân sự dự án
export async function getProjectTeam(id: string) {
  const { data, error } = await supabase
    .from("project_team")
    .select("*, employees(name, position, department)")
    .eq("project_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching project team:", error)
    throw new Error("Không thể lấy danh sách nhân sự dự án")
  }

  return data
}
