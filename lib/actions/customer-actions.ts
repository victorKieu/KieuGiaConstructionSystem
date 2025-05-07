"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Định nghĩa kiểu dữ liệu cho form khách hàng
export type CustomerFormData = {
  id?: string
  code?: string
  name: string
  type: "company" | "individual" | "government"
  status: "active" | "potential" | "inactive"
  phone?: string
  email?: string
  address?: string
  tax_code?: string
  website?: string
  description?: string
  birthday?: string
  sales_channel?: string
  geocode?: string
}

// Hàm tạo mã khách hàng tự động
export function generateCustomerCode(type: string, count: number): string {
  const prefix = type === "individual" ? "CN" : type === "government" ? "CQ" : "DN"
  const paddedCount = String(count + 1).padStart(5, "0")
  return `${prefix}${paddedCount}`
}

// Lấy số lượng khách hàng theo loại để tạo mã
export async function getCustomerCountByType(type: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("type", type)

    if (error) {
      console.error("Error counting customers:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error in getCustomerCountByType:", error)
    return 0
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
      const count = await getCustomerCountByType(customerData.type)
      customerData.code = generateCustomerCode(customerData.type, count)
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          code: customerData.code,
          name: customerData.name,
          type: customerData.type,
          status: customerData.status || "active",
          phone: customerData.phone || null,
          email: customerData.email || null,
          address: customerData.address || null,
          tax_code: customerData.tax_code || null,
          website: customerData.website || null,
          description: customerData.description || null,
          birthday: customerData.birthday || null,
          sales_channel: customerData.sales_channel || null,
          geocode: customerData.geocode || null,
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
        name: customerData.name,
        type: customerData.type,
        status: customerData.status,
        phone: customerData.phone || null,
        email: customerData.email || null,
        address: customerData.address || null,
        tax_code: customerData.tax_code || null,
        website: customerData.website || null,
        description: customerData.description || null,
        birthday: customerData.birthday || null,
        sales_channel: customerData.sales_channel || null,
        geocode: customerData.geocode || null,
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

// Lấy danh sách kênh bán hàng
export function getSalesChannels() {
  return [
    { value: "sales_staff", label: "Nhân viên kinh doanh" },
    { value: "online_marketing", label: "Marketing online" },
    { value: "affiliate", label: "Cộng tác viên" },
    { value: "referral", label: "Giới thiệu" },
    { value: "exhibition", label: "Hội chợ/Triển lãm" },
    { value: "direct", label: "Trực tiếp" },
    { value: "other", label: "Khác" },
  ]
}
