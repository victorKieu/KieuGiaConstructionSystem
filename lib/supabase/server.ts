import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient(cookieStore = cookies()) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Thiếu thông tin kết nối Supabase. URL:", !!supabaseUrl, "Key:", !!supabaseKey)
    throw new Error("Thiếu thông tin kết nối Supabase")
  }

  console.log("Tạo Supabase client với URL:", supabaseUrl)

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.error("Lỗi khi set cookie:", error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.error("Lỗi khi remove cookie:", error)
        }
      },
    },
  })
}
