import { createBrowserClient } from "@supabase/ssr"

// Kiểm tra xem Supabase đã sẵn sàng chưa
export const isSupabaseReady = () => {
  return !!(
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Singleton pattern để tránh tạo nhiều client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (!isSupabaseReady()) {
    throw new Error("Supabase credentials are not available")
  }

  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return supabaseClient
}

// Export supabase instance for direct use
export const supabase = isSupabaseReady()
  ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null
