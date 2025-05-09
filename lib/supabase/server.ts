import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

export function createClient() {
  // Kiểm tra xem có đang trong quá trình build không
  const isBuildProcess =
    process.env.NODE_ENV === "production" && typeof window === "undefined" && !process.env.VERCEL_ENV

  if (isBuildProcess) {
    // Trả về client giả trong quá trình build
    return {
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
  }

  try {
    const cookieStore = cookies()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials in server context")
      throw new Error("Missing Supabase credentials")
    }

    // Create a Supabase client with the service role key for server-side operations
    return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Trả về client giả nếu có lỗi
    return {
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
  }
}

// Thêm export createServerSupabaseClient để tương thích với code hiện tại
export const createServerSupabaseClient = createClient
