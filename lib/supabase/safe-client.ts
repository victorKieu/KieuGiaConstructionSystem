import { createClient } from "@supabase/supabase-js"

// Tạo Supabase client với xử lý lỗi
export function createSafeClient() {
    // Kiểm tra biến môi trường
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Supabase environment variables are not defined")
    }

    // Tạo client
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Tạo Supabase client với xử lý lỗi và trả về null nếu không thể tạo
export function createSafeClientOrNull() {
    try {
        // Kiểm tra biến môi trường
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error("Supabase environment variables are not defined")
            return null
        }

        // Tạo client
        return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    } catch (error) {
        console.error("Error creating Supabase client:", error)
        return null
    }
}
