"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

export type CustomerFormData = {
  id?: string
  code?: string
  name: string
  type: string
  status?: string
  phone?: string | null
  email?: string | null
  address?: string | null
  tax_code?: string | null
  website?: string | null
  description?: string | null
  birthday?: string | null
  sales_channel?: string | null
  geocode?: string | null
  created_at?: string
  updated_at?: string
}

// Lấy danh sách khách hàng
export async function getCustomers() {
  try {
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomers:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách khách hàng", data: [] }
  }
}

// Lấy chi tiết khách hàng theo ID
export async function getCustomerById(id: string) {
  try {
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching customer:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomerById:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thông tin khách hàng" }
  }
}

// Tạo khách hàng mới
export async function createCustomer(customerData: CustomerFormData) {
  try {
    // Tạo mã khách hàng tự động nếu không có
    if (!customerData.code) {
      const prefix = customerData.type === "company" ? "DN" : customerData.type === "individual" ? "CN" : "NH"
      const timestamp = Date.now().toString().slice(-6)
      customerData.code = `${prefix}${timestamp}`
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          ...customerData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error creating customer:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the customers page
    revalidatePath("/dashboard/customers")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in createCustomer:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo khách hàng mới" }
  }
}

// Cập nhật khách hàng
export async function updateCustomer(id: string, customerData: CustomerFormData) {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update({
        ...customerData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating customer:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the customers pages
    revalidatePath(`/dashboard/customers/${id}`)
    revalidatePath("/dashboard/customers")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in updateCustomer:", error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật khách hàng" }
  }
}

// Xóa khách hàng
export async function deleteCustomer(id: string) {
  try {
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting customer:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the customers page
    revalidatePath("/dashboard/customers")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCustomer:", error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa khách hàng" }
  }
}

// Lấy danh sách liên hệ của khách hàng
export async function getCustomerContacts(customerId: string) {
  try {
    const { data, error } = await supabase
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", customerId)
      .order("is_primary", { ascending: false })

    if (error) {
      console.error("Error fetching customer contacts:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomerContacts:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách liên hệ của khách hàng", data: [] }
  }
}

// Lấy danh sách dự án của khách hàng
export async function getCustomerProjects(customerId: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customer projects:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getCustomerProjects:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án của khách hàng", data: [] }
  }
}

export async function getSalesChannels() {
  return [
    { value: "direct", label: "Bán hàng trực tiếp" },
    { value: "online", label: "Bán hàng trực tuyến" },
    { value: "agent", label: "Đại lý" },
    { value: "other", label: "Khác" },
  ]
}

export async function getCustomerCountByType(type: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("type", type)

    if (error) {
      console.error("Error fetching customer count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getCustomerCountByType:", error)
    return 0
  }
}

export function generateCustomerCode(type: string, count: number): string {
  const prefix = type === "company" ? "DN" : type === "individual" ? "CN" : "NH"
  const paddedCount = String(count + 1).padStart(4, "0")
  return `${prefix}-${paddedCount}`
}
