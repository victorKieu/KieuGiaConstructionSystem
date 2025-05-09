import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Singleton pattern để tránh tạo nhiều client
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are not defined")
    throw new Error("Supabase environment variables are not defined")
  }

  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  }

  return supabaseInstance
}

// Hàm kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
