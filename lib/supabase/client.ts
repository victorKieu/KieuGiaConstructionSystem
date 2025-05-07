import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Singleton pattern để tránh tạo nhiều client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }
  return supabaseClient
}

// Export supabase client instance để các file khác có thể sử dụng trực tiếp
export const supabase = createClient()

// Kiểm tra xem Supabase đã sẵn sàng chưa
export const isSupabaseReady = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Thêm các hàm tiện ích khác
export const getUser = async () => {
  try {
    const client = createClient()
    const { data, error } = await client.auth.getUser()
    if (error) throw error
    return data.user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export const getSession = async () => {
  try {
    const client = createClient()
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}
