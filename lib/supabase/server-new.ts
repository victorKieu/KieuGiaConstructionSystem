import { createClient as createClientBase } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Tạo client cho phía server
export const createClient = () => {
  // Kiểm tra và đảm bảo các biến môi trường tồn tại
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL || ""

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("Thiếu biến môi trường Supabase URL hoặc Key")
    // Trả về một client giả để tránh lỗi runtime
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ data: null, error: null }),
      }),
    } as any
  }

  return createClientBase<Database>(supabaseUrl, supabaseKey)
}
