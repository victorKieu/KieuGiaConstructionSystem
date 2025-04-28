import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
    try {
        const supabase = createClient()

        // Kiểm tra phiên đăng nhập
        const {
            data: { session },
        } = await supabase.auth.getSession()

        // Các đường dẫn công khai không cần xác thực
        const publicPaths = ["/login", "/register", "/api/auth", "/"]
        const isPublicPath = publicPaths.some(
            (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
        )

        // Các đường dẫn tĩnh không cần xác thực
        const isStaticPath =
            request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) ||
            request.nextUrl.pathname.startsWith("/_next/")

        // Nếu không có phiên đăng nhập và không phải là đường dẫn công khai hoặc tĩnh
        if (!session && !isPublicPath && !isStaticPath) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        // Nếu đã đăng nhập và đang truy cập trang đăng nhập/đăng ký
        if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error("Middleware error:", error)
        // Trong trường hợp lỗi, cho phép request tiếp tục
        return NextResponse.next()
    }
}

// Chỉ áp dụng middleware cho các đường dẫn sau
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

