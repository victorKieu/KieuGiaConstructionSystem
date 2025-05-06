import { createClient } from "@supabase/supabase-js"

// Kiểm tra xem có đang trong quá trình build không
const isBuildProcess = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "production"

// Tạo Supabase client với xử lý lỗi
export function createSafeClient() {
    // Nếu đang trong quá trình build, trả về client giả
    if (isBuildProcess) {
        console.warn("Build process detected, returning mock Supabase client")
        return createMockClient()
    }

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
        // Nếu đang trong quá trình build, trả về client giả
        if (isBuildProcess) {
            console.warn("Build process detected, returning mock Supabase client")
            return createMockClient()
        }

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

// Tạo client giả cho quá trình build
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
        },
    }
}
