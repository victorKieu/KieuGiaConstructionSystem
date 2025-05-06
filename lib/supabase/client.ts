import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Kiểm tra xem có đang trong quá trình build không
const isBuildProcess = process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL

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

// Export createClient để tương thích với code hiện tại
export const createClient = () => {
  if (isBuildProcess) {
    console.warn("Build process detected, returning mock Supabase client")
    return mockClient
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are not defined")
    return mockClient
  }

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Tạo client thực hoặc client giả tùy thuộc vào môi trường
export const supabase = isBuildProcess
  ? mockClient
  : createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

// Hàm kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
