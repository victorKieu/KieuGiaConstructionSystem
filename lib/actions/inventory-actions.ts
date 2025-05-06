"use server"

import { createClient } from "@/lib/supabase/server"

export async function getMaterials() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("materials").select("*").order("name")

    if (error) {
      console.error("Error fetching materials:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getMaterials:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy dữ liệu vật tư" }
  }
}

export async function getMaterialById(id: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("materials").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching material:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getMaterialById:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thông tin vật tư" }
  }
}

export async function createMaterial(materialData: any) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("materials").insert(materialData).select()

    if (error) {
      console.error("Error creating material:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createMaterial:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo vật tư mới" }
  }
}

export async function updateMaterial(id: string, materialData: any) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("materials").update(materialData).eq("id", id).select()

    if (error) {
      console.error("Error updating material:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateMaterial:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật vật tư" }
  }
}

export async function deleteMaterial(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("materials").delete().eq("id", id)

    if (error) {
      console.error("Error deleting material:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteMaterial:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa vật tư" }
  }
}
