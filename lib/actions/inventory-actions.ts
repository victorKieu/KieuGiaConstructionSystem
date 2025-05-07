"use server"

import { createServerSupabaseClient } from "../supabase/server"
import { revalidatePath } from "next/cache"

export async function getInventoryItems() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("inventory").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching inventory items:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Error in getInventoryItems:", error)
    return { error: "Failed to fetch inventory items" }
  }
}

export async function getInventoryItemById(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("inventory").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching inventory item:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Error in getInventoryItemById:", error)
    return { error: "Failed to fetch inventory item" }
  }
}

export async function createInventoryItem(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const unit = formData.get("unit") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          name,
          description,
          quantity,
          unit,
          category,
          price,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating inventory item:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/inventory")
    return { data }
  } catch (error) {
    console.error("Error in createInventoryItem:", error)
    return { error: "Failed to create inventory item" }
  }
}

export async function updateInventoryItem(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const unit = formData.get("unit") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("inventory")
      .update({
        name,
        description,
        quantity,
        unit,
        category,
        price,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating inventory item:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/inventory")
    return { data }
  } catch (error) {
    console.error("Error in updateInventoryItem:", error)
    return { error: "Failed to update inventory item" }
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("inventory").delete().eq("id", id)

    if (error) {
      console.error("Error deleting inventory item:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error)
    return { error: "Failed to delete inventory item" }
  }
}
