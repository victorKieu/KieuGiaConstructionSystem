import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
    const cookieStore = cookies()

    // Kiểm tra và đảm bảo các biến môi trường tồn tại
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL

    const supabaseAnonKey =
        process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Thiếu biến môi trường Supabase URL hoặc Anon Key")
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

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name) {
                return cookieStore.get(name)?.value
            },
            set(name, value, options) {
                try {
                    cookieStore.set(name, value, options)
                } catch (error) {
                    // Xử lý lỗi khi không thể thiết lập cookie trong môi trường read-only
                    console.error("Error setting cookie:", error)
                }
            },
            remove(name, options) {
                try {
                    cookieStore.set(name, "", { ...options, maxAge: 0 })
                } catch (error) {
                    // Xử lý lỗi khi không thể xóa cookie trong môi trường read-only
                    console.error("Error removing cookie:", error)
                }
            },
        },
    })
}
