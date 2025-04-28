import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
    const cookieStore = cookies()

    return createServerClient(
        process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
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
        },
    )
}
