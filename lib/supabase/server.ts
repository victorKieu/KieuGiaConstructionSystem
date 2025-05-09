import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Tạo một mock client để sử dụng trong quá trình build
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
} as any

export function createClient() {
  // Kiểm tra xem có đang trong quá trình build không
  const isBuildProcess =
    process.env.NODE_ENV === "production" && typeof window === "undefined" && !process.env.VERCEL_ENV

  if (isBuildProcess) {
    console.log("Using mock Supabase client during build process")
    return mockClient
  }

  try {
    // Kiểm tra xem có đang trong quá trình build không
    if (typeof window === "undefined") {
      // Server-side
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing Supabase credentials in server context")
        return mockClient
      }

      // Create a Supabase client with the service role key for server-side operations
      return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      )
    } else {
      // Client-side
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase credentials in client context")
        return mockClient
      }

      // Create a Supabase client with the anon key for client-side operations
      return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      )
    }
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return mockClient
  }
}

// Thêm export createServerSupabaseClient để tương thích với code hiện tại
export const createServerSupabaseClient = createClient

// Thêm export supabase để tương thích với code hiện tại
export const supabase = createClient()
