import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Kiểm tra xem biến môi trường có tồn tại không
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Kiểm tra xem Supabase đã sẵn sàng chưa
export function isSupabaseReady() {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Tạo client Supabase
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Hàm kiểm tra kết nối Supabase
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("projects").select("count").single()

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Kết nối Supabase thành công", data }
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return { success: false, error: "Lỗi khi kiểm tra kết nối Supabase" }
  }
}
