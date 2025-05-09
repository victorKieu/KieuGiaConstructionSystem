import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Singleton pattern để tránh tạo nhiều client
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side: Sử dụng biến môi trường server
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("Missing Supabase credentials in server environment")
      // Trả về mock client để tránh lỗi
      return createMockClient()
    }

    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    }
  } else {
    // Client-side: Sử dụng biến môi trường public
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase credentials in client environment")
      // Trả về mock client để tránh lỗi
      return createMockClient()
    }

    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      )
    }
  }

  return supabaseInstance
}

// Tạo mock client để tránh lỗi trong quá trình build
function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  } as any
}

// Export supabase instance để tương thích với code hiện tại
export const supabase = createClient()

// Hàm kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  if (typeof window === "undefined") {
    return !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY
  } else {
    return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}
