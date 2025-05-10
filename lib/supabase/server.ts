import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Kiểm tra xem có đang trong quá trình build không
const isBuildProcess = process.env.NODE_ENV === "production" && !process.env.VERCEL_URL

// Tạo một client giả cho quá trình build
const mockServerClient = {
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
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
}

export function createServerSupabaseClient() {
  if (isBuildProcess) {
    console.warn("Build process detected, returning mock Supabase server client")
    return mockServerClient
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in server context")
    return mockServerClient
  }

  // Create a Supabase client with the service role key for server-side operations
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "x-client-info": "server",
      },
    },
  })
}

// Tạo client sử dụng cookies từ request
export function createBrowserClient() {
  if (isBuildProcess) {
    return mockServerClient
  }

  try {
    const cookieStore = cookies()

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return mockServerClient
  }
}
