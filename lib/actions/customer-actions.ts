"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import type { CustomerFormData } from "@/types/customer"

// Hàm tạo mã khách hàng tự động
function generateCustomerCode(type: string): string {
  const timestamp = Date.now().toString().slice(-4)

  switch (type) {
    case "company":
      return `KDN-${timestamp}`
    case "individual":
      return `KCN-${timestamp}`
    case "government":
      return `KCQ-${timestamp}`
    default:
      return `KH-${timestamp}`
  }
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
      customerData.code = generateCustomerCode(customerData.type)
    }

    // Thêm thời gian tạo và cập nhật
    const now = new Date().toISOString()
    const dataToInsert = {
      ...customerData,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase.from("customers").insert([dataToInsert]).select()

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
