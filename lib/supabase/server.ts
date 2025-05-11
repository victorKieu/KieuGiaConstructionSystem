import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Xử lý lỗi khi không thể đặt cookie trong môi trường read-only
            console.error("Cannot set cookie in read-only context:", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Xử lý lỗi khi không thể xóa cookie trong môi trường read-only
            console.error("Cannot remove cookie in read-only context:", error)
          }
        },
      },
    },
  )
}

// Export createClient để tương thích với code hiện tại
export const createClient = createServerSupabaseClient
