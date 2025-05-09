"use server"

import { createClient } from "@/lib/supabase/server"
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
    console.log("🔍 Đang lấy danh sách khách hàng từ Supabase...")

    const supabase = createClient()
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Lỗi khi lấy danh sách khách hàng:", error)
      return { success: false, error: error.message, data: [] }
    }

    console.log(`✅ Đã lấy ${data?.length || 0} khách hàng`)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách khách hàng:", error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách khách hàng", data: [] }
  }
}

// Lấy chi tiết khách hàng theo ID
export async function getCustomerById(id: string) {
  try {
    console.log(`🔍 Đang lấy thông tin khách hàng với ID: ${id}`)

    const supabase = createClient()
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log(`❓ Không tìm thấy khách hàng với ID: ${id}`)
        return { success: false, error: "Không tìm thấy khách hàng" }
      }

      console.error(`❌ Lỗi khi lấy thông tin khách hàng ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Đã lấy thông tin khách hàng: ${data.name}`)
    return { success: true, data }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy thông tin khách hàng ID ${id}:`, error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy thông tin khách hàng" }
  }
}

// Tạo khách hàng mới
export async function createCustomer(customerData: CustomerFormData) {
  try {
    console.log("📝 Đang tạo khách hàng mới...")

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

    console.log("📋 Dữ liệu khách hàng mới:", {
      code: dataToInsert.code,
      name: dataToInsert.name,
      type: dataToInsert.type,
      status: dataToInsert.status,
    })

    const supabase = createClient()
    const { data, error } = await supabase.from("customers").insert([dataToInsert]).select()

    if (error) {
      console.error("❌ Lỗi khi tạo khách hàng mới:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Đã tạo khách hàng mới:", data[0])

    // Revalidate the customers page
    revalidatePath("/dashboard/customers")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("❌ Lỗi khi tạo khách hàng mới:", error)
    return { success: false, error: "Đã xảy ra lỗi khi tạo khách hàng mới" }
  }
}

// Cập nhật khách hàng
export async function updateCustomer(id: string, customerData: CustomerFormData) {
  try {
    console.log(`📝 Đang cập nhật thông tin khách hàng ID: ${id}`)

    console.log("📋 Dữ liệu cập nhật:", {
      name: customerData.name,
      type: customerData.type,
      status: customerData.status,
    })

    const supabase = createClient()
    const { data, error } = await supabase
      .from("customers")
      .update({
        ...customerData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`❌ Lỗi khi cập nhật khách hàng ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Đã cập nhật thông tin khách hàng ID ${id}:`, data[0])

    // Revalidate the customers pages
    revalidatePath(`/dashboard/customers/${id}`)
    revalidatePath("/dashboard/customers")

    return { success: true, data: data[0] }
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật khách hàng ID ${id}:`, error)
    return { success: false, error: "Đã xảy ra lỗi khi cập nhật khách hàng" }
  }
}

// Xóa khách hàng
export async function deleteCustomer(id: string) {
  try {
    console.log(`🗑️ Đang xóa khách hàng ID: ${id}`)

    const supabase = createClient()
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      console.error(`❌ Lỗi khi xóa khách hàng ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Đã xóa khách hàng ID ${id}`)

    // Revalidate the customers page
    revalidatePath("/dashboard/customers")

    return { success: true }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa khách hàng ID ${id}:`, error)
    return { success: false, error: "Đã xảy ra lỗi khi xóa khách hàng" }
  }
}

// Lấy danh sách liên hệ của khách hàng
export async function getCustomerContacts(customerId: string) {
  try {
    console.log(`🔍 Đang lấy danh sách liên hệ của khách hàng ID: ${customerId}`)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", customerId)
      .order("is_primary", { ascending: false })

    if (error) {
      console.error(`❌ Lỗi khi lấy danh sách liên hệ của khách hàng ID ${customerId}:`, error)
      return { success: false, error: error.message, data: [] }
    }

    console.log(`✅ Đã lấy ${data?.length || 0} liên hệ của khách hàng ID ${customerId}`)
    return { success: true, data }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách liên hệ của khách hàng ID ${customerId}:`, error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách liên hệ của khách hàng", data: [] }
  }
}

// Lấy danh sách dự án của khách hàng
export async function getCustomerProjects(customerId: string) {
  try {
    console.log(`🔍 Đang lấy danh sách dự án của khách hàng ID: ${customerId}`)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`❌ Lỗi khi lấy danh sách dự án của khách hàng ID ${customerId}:`, error)
      return { success: false, error: error.message, data: [] }
    }

    console.log(`✅ Đã lấy ${data?.length || 0} dự án của khách hàng ID ${customerId}`)
    return { success: true, data }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách dự án của khách hàng ID ${customerId}:`, error)
    return { success: false, error: "Đã xảy ra lỗi khi lấy danh sách dự án của khách hàng", data: [] }
  }
}
