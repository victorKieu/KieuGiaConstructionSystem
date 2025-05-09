import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  try {
    // Tạo Supabase client
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })

    // Kiểm tra session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Danh sách các route công khai không cần xác thực
    const publicRoutes = ["/login", "/api/auth-status", "/api/health"]
    const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    // Nếu là route công khai, cho phép truy cập
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Nếu là trang chủ, chuyển hướng đến trang đăng nhập
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Nếu không có session và không phải route công khai, chuyển hướng đến trang đăng nhập
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("returnUrl", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Cho phép truy cập nếu có session
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Nếu có lỗi, cho phép truy cập để tránh lỗi 500
    return NextResponse.next()
  }
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
