"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Định nghĩa kiểu dữ liệu cho nhân viên
export interface Employee {
  id: string
  code?: string
  name: string
  position: string
  department: string
  phone?: string
  email?: string
  address?: string
  hire_date: string | Date
  status?: string
  notes?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// Định nghĩa kiểu dữ liệu cho thống kê nhân viên
export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  onLeaveEmployees: number
  terminatedEmployees: number
  newEmployees: number
  recentActivities: any[]
}

// Hàm tạo Supabase client
function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Lấy danh sách nhân viên
export async function getEmployees(): Promise<Employee[]> {
  try {
    console.log("🔍 Đang lấy danh sách nhân viên từ Supabase...")

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error)
      throw new Error(`Không thể lấy danh sách nhân viên: ${error.message}`)
    }

    console.log(`✅ Đã lấy ${data?.length || 0} nhân viên`)
    return data || []
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên:", error)
    throw error
  }
}

// Lấy thông tin nhân viên theo ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    console.log(`🔍 Đang lấy thông tin nhân viên với ID:
