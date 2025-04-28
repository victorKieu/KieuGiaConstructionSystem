import { createBrowserClient } from "@supabase/ssr"

let supabase: any

export function createClient() {
    if (supabase) return supabase

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

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

    return supabase
}
