"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type CustomerFormData = {
  name: string
  type: string
  contact_person: string
  phone: string
  email: string
  address: string
  tax_code: string
  notes?: string
  code?: string
}

export async function getCustomers() {
  const supabase = createClient()

  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data }
}

export async function getCustomerById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching customer:", error)
    return { success: false, error: error.message, data: null }
  }

  return { success: true, data }
}

export async function createCustomer(formData: CustomerFormData) {
  const supabase = createClient()

  // Chuyển đổi dữ liệu từ form sang định dạng phù hợp với bảng customers
  const customerData = {
    name: formData.name,
    type: formData.type,
    contact_person: formData.contact_person,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    tax_code: formData.tax_code,
    notes: formData.notes || null,
    code: formData.code || null,
  }

  const { data, error } = await supabase.from("customers").insert([customerData]).select()

  if (error) {
    console.error("Error creating customer:", error)
    return { success: false, error: error.message, data: null }
  }

  revalidatePath("/dashboard/customers")
  return { success: true, data: data[0] }
}

export async function updateCustomer(id: string, formData: CustomerFormData) {
  const supabase = createClient()

  // Chuyển đổi dữ liệu từ form sang định dạng phù hợp với bảng customers
  const customerData = {
    name: formData.name,
    type: formData.type,
    contact_person: formData.contact_person,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    tax_code: formData.tax_code,
    notes: formData.notes || null,
    code: formData.code || null,
  }

  const { data, error } = await supabase.from("customers").update(customerData).eq("id", id).select()

  if (error) {
    console.error("Error updating customer:", error)
    return { success: false, error: error.message, data: null }
  }

  revalidatePath("/dashboard/customers")
  revalidatePath(`/dashboard/customers/${id}`)
  return { success: true, data: data[0] }
}

export async function deleteCustomer(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/customers")
  return { success: true }
}

export async function getCustomerContacts(customerId: string) {
  const supabase = createClient()

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
}

export async function getCustomerProjects(customerId: string) {
  const supabase = createClient()

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
}
