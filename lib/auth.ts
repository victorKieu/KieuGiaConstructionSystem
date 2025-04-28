import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Export biến auth để các file khác có thể import
export const auth = {
    getSession,
    getCurrentUser,
    requireAuth,
}

// Kiểm tra xem người dùng đã đăng nhập chưa
export async function getSession() {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            throw error
        }
        return data.session
    } catch (error) {
        console.error("Lỗi khi lấy phiên đăng nhập:", error)
        return null
    }
}

// Lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        }
        return data.user
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error)
        return null
    }
}

// Middleware để kiểm tra xác thực
export async function requireAuth(request) {
    const session = await getSession()
    if (!session) {
        // Thay vì sử dụng redirect từ next/navigation, sử dụng NextResponse.redirect
        return NextResponse.redirect(new URL("/login", request.url))
    }
    return session
}
