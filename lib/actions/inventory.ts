"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách vật tư
export async function getMaterials() {
  const { data, error } = await supabase.from("materials").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching materials:", error)
    throw new Error("Không thể lấy danh sách vật tư")
  }

  return data
}

// Lấy chi tiết vật tư
export async function getMaterialById(id: string) {
  const { data, error } = await supabase.from("materials").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching material:", error)
    throw new Error("Không thể lấy thông tin vật tư")
  }

  return data
}

// Tạo vật tư mới
export async function createMaterial(materialData: any) {
  const { data, error } = await supabase.from("materials").insert([materialData]).select()

  if (error) {
    console.error("Error creating material:", error)
    throw new Error("Không thể tạo vật tư mới")
  }

  revalidatePath("/dashboard/inventory")
  return data[0]
}

// Cập nhật vật tư
export async function updateMaterial(id: string, materialData: any) {
  const { data, error } = await supabase.from("materials").update(materialData).eq("id", id).select()

  if (error) {
    console.error("Error updating material:", error)
    throw new Error("Không thể cập nhật vật tư")
  }

  revalidatePath(`/dashboard/inventory/materials/${id}`)
  revalidatePath("/dashboard/inventory/materials")
  return data[0]
}

// Xóa vật tư
export async function deleteMaterial(id: string) {
  const { error } = await supabase.from("materials").delete().eq("id", id)

  if (error) {
    console.error("Error deleting material:", error)
    throw new Error("Không thể xóa vật tư")
  }

  revalidatePath("/dashboard/inventory/materials")
  return { success: true }
}

// Lấy danh sách kho
export async function getWarehouses() {
  const { data, error } = await supabase
    .from("warehouses")
    .select("*, employees(name)")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching warehouses:", error)
    throw new Error("Không thể lấy danh sách kho")
  }

  return data
}

// Lấy tồn kho theo kho
export async function getWarehouseInventory(warehouseId: string) {
  const { data, error } = await supabase
    .from("warehouse_inventory")
    .select("*, materials(name, code, unit)")
    .eq("warehouse_id", warehouseId)

  if (error) {
    console.error("Error fetching warehouse inventory:", error)
    throw new Error("Không thể lấy danh sách tồn kho")
  }

  return data
}

// Thêm giao dịch kho
export async function addInventoryTransaction(transactionData: any) {
  // Bắt đầu transaction
  const { data, error } = await supabase.from("inventory_transactions").insert([transactionData]).select()

  if (error) {
    console.error("Error adding inventory transaction:", error)
    throw new Error("Không thể thêm giao dịch kho")
  }

  // Cập nhật tồn kho
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("warehouse_inventory")
    .select("*")
    .eq("warehouse_id", transactionData.warehouse_id)
    .eq("material_id", transactionData.material_id)
    .single()

  if (inventoryError && inventoryError.code !== "PGRST116") {
    console.error("Error fetching inventory:", inventoryError)
    throw new Error("Không thể lấy thông tin tồn kho")
  }

  let newQuantity = transactionData.quantity
  if (transactionData.type === "out") {
    newQuantity = -newQuantity
  }

  if (inventoryData) {
    // Cập nhật tồn kho hiện có
    const { error: updateError } = await supabase
      .from("warehouse_inventory")
      .update({
        quantity: inventoryData.quantity + newQuantity,
        last_updated: new Date().toISOString(),
      })
      .eq("id", inventoryData.id)

    if (updateError) {
      console.error("Error updating inventory:", updateError)
      throw new Error("Không thể cập nhật tồn kho")
    }
  } else {
    // Tạo mới tồn kho
    const { error: insertError } = await supabase.from("warehouse_inventory").insert([
      {
        warehouse_id: transactionData.warehouse_id,
        material_id: transactionData.material_id,
        quantity: newQuantity,
        last_updated: new Date().toISOString(),
      },
    ])

    if (insertError) {
      console.error("Error inserting inventory:", insertError)
      throw new Error("Không thể tạo mới tồn kho")
    }
  }

  revalidatePath(`/dashboard/inventory/warehouses/${transactionData.warehouse_id}`)
  return data[0]
}

// Lấy danh sách nhà cung cấp
export async function getSuppliers() {
  const { data, error } = await supabase.from("suppliers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw new Error("Không thể lấy danh sách nhà cung cấp")
  }

  return data
}

// Lấy danh sách yêu cầu vật tư
export async function getMaterialRequests() {
  const { data, error } = await supabase
    .from("material_requests")
    .select("*, employees!requested_by(name), employees!approved_by(name), projects(name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching material requests:", error)
    throw new Error("Không thể lấy danh sách yêu cầu vật tư")
  }

  return data
}
