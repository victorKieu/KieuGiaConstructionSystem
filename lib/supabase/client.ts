"use client"

import { createBrowserClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { isSupabaseReady } from "@/lib/supabase/utils"

// Biến để kiểm tra xem Supabase đã được khởi tạo chưa
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

// Tạo Supabase client cho phía client
export function createClient() {
  if (!isSupabaseReady()) {
    console.error("Supabase environment variables are not set")
    throw new Error("Supabase environment variables are not set")
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// Singleton pattern để tránh tạo nhiều instance
function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

// Export supabase client để sử dụng trong ứng dụng
export const supabase = getSupabaseClient()
