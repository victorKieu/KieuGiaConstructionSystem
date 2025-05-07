import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  try {
    // Tạo Supabase client
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Kiểm tra session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Nếu không có session và không phải trang login, chuyển hướng đến trang login
    const isAuthRoute = request.nextUrl.pathname === "/login"
    const isApiRoute = request.nextUrl.pathname.startsWith("/api/")
    const isPublicRoute = ["/", "/register", "/forgot-password"].includes(request.nextUrl.pathname)

    if (!session && !isAuthRoute && !isPublicRoute && !isApiRoute) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)

    // Trong trường hợp lỗi, cho phép request tiếp tục để tránh chặn hoàn toàn ứng dụng
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
