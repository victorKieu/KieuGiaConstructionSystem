import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Tạo một mock client để sử dụng trong quá trình build
function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  } as any
}

// Tạo Supabase client cho server-side
export function createClient() {
  try {
    // Trong quá trình build, trả về mock client
    if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
      // Kiểm tra xem có đang trong quá trình build không
      if (process.env.NEXT_PHASE === "phase-production-build") {
        console.log("Using mock Supabase client during build")
        return createMockClient()
      }
    }

    // Kiểm tra biến môi trường
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return createMockClient()
    }

    // Tạo client thực
    return createSupabaseClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// Export một instance để tương thích với code hiện tại
export const supabase = createClient()
