"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type CustomerFormData = {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  tax_code?: string
  representative?: string
  position?: string
  notes?: string
}

export async function getCustomers() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Exception fetching customers:", error)
    return { error: "Failed to fetch customers" }
  }
}

export async function getCustomerById(id: string) {
  const supabase = createClient()

  try {
    // Lấy thông tin khách hàng
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching customer:", error)
      return { error: error.message }
    }

    if (!data) {
      return { error: "Customer not found" }
    }

    return { data }
  } catch (error) {
    console.error("Exception fetching customer:", error)
    return { error: "Failed to fetch customer" }
  }
}

export async function createCustomer(formData: CustomerFormData) {
  const supabase = createClient()

  try {
    // Tạo khách hàng mới
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          tax_code: formData.tax_code || null,
          representative: formData.representative || null,
          position: formData.position || null,
          notes: formData.notes || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating customer:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/customers")
    return { data }
  } catch (error) {
    console.error("Exception creating customer:", error)
    return { error: "Failed to create customer" }
  }
}

export async function updateCustomer(id: string, formData: CustomerFormData) {
  const supabase = createClient()

  try {
    // Cập nhật thông tin khách hàng
    const { data, error } = await supabase
      .from("customers")
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        tax_code: formData.tax_code || null,
        representative: formData.representative || null,
        position: formData.position || null,
        notes: formData.notes || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating customer:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/customers")
    revalidatePath(`/dashboard/customers/${id}`)
    return { data }
  } catch (error) {
    console.error("Exception updating customer:", error)
    return { error: "Failed to update customer" }
  }
}

export async function deleteCustomer(id: string) {
  const supabase = createClient()

  try {
    // Xóa khách hàng
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting customer:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/customers")
    return { success: true }
  } catch (error) {
    console.error("Exception deleting customer:", error)
    return { error: "Failed to delete customer" }
  }
}
