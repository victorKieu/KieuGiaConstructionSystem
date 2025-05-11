import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Singleton pattern để tránh tạo nhiều client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  if (typeof window === "undefined") {
    // Trả về client giả khi đang trong quá trình build
    return createMockClient()
  }

  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  return supabaseClient
}

// Client giả cho quá trình build
function createMockClient() {
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
  }
}

// Export supabase instance
export const supabase = createClient()

// Kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Thêm hàm testSupabaseConnection
export async function testSupabaseConnection() {
  try {
    const client = createClient()
    const { data, error } = await client.from("test").select("*").limit(1)

    if (error) {
      return {
        success: false,
        message: `Lỗi kết nối: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: "Kết nối thành công",
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: `Lỗi không xác định: ${error instanceof Error ? error.message : String(error)}`,
      error,
    }
  }
}
