"use server"

import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Lấy danh sách khách hàng
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    throw new Error("Không thể lấy danh sách khách hàng")
  }

  return data
}

// Lấy chi tiết khách hàng
export async function getCustomerById(id: string) {
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching customer:", error)
    throw new Error("Không thể lấy thông tin khách hàng")
  }

  return data
}

// Tạo khách hàng mới
export async function createCustomer(customerData: any) {
  const { data, error } = await supabase.from("customers").insert([customerData]).select()

  if (error) {
    console.error("Error creating customer:", error)
    throw new Error("Không thể tạo khách hàng mới")
  }

  revalidatePath("/dashboard/customers")
  return data[0]
}

// Cập nhật khách hàng
export async function updateCustomer(id: string, customerData: any) {
  const { data, error } = await supabase.from("customers").update(customerData).eq("id", id).select()

  if (error) {
    console.error("Error updating customer:", error)
    throw new Error("Không thể cập nhật khách hàng")
  }

  revalidatePath(`/dashboard/customers/${id}`)
  revalidatePath("/dashboard/customers")
  return data[0]
}

// Xóa khách hàng
export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting customer:", error)
    throw new Error("Không thể xóa khách hàng")
  }

  revalidatePath("/dashboard/customers")
  return { success: true }
}

// Lấy danh sách liên hệ của khách hàng
export async function getCustomerContacts(customerId: string) {
  const { data, error } = await supabase
    .from("customer_contacts")
    .select("*")
    .eq("customer_id", customerId)
    .order("is_primary", { ascending: false })

  if (error) {
    console.error("Error fetching customer contacts:", error)
    throw new Error("Không thể lấy danh sách liên hệ của khách hàng")
  }

  return data
}

// Lấy lịch sử giao dịch của khách hàng
export async function getCustomerTransactions(customerId: string) {
  const { data, error } = await supabase
    .from("customer_transactions")
    .select("*, projects(name)")
    .eq("customer_id", customerId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching customer transactions:", error)
    throw new Error("Không thể lấy lịch sử giao dịch của khách hàng")
  }

  return data
}
