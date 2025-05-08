import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Kiểm tra môi trường
const isBrowser = typeof window !== "undefined"
const isServer = !isBrowser

// Log thông tin môi trường để debug
console.log("Environment:", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
  isBrowser,
  isServer,
})

// Tạo một client giả cho quá trình build
const mockClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        data: null,
        error: null,
      }),
      data: null,
      error: null,
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
  },
}

// Kiểm tra xem có đủ thông tin để tạo client không
const hasSupabaseCredentials = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Tạo Supabase client thực nếu có đủ thông tin
const supabaseClient = hasSupabaseCredentials
  ? createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
      },
    })
  : mockClient

// Export client để sử dụng trong ứng dụng
export const supabase = supabaseClient

// Hàm kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  return hasSupabaseCredentials
}
