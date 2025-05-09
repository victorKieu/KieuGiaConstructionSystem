import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Danh sách các đường dẫn công khai không cần xác thực
  const publicPaths = ["/login", "/api/auth", "/api/debug", "/api/system-check", "/welcome"]

  // Kiểm tra xem đường dẫn hiện tại có nằm trong danh sách công khai không
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Nếu là đường dẫn công khai, cho phép truy cập
  if (isPublicPath) {
    return NextResponse.next()
  }

  try {
    // Tạo response để có thể sửa đổi cookie
    const response = NextResponse.next()

    // Tạo Supabase client sử dụng cookies từ request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          },
          remove(name, options) {
            request.cookies.set(name, "")
            response.cookies.set(name, "", { ...options, maxAge: 0 })
          },
        },
      },
    )

    // Kiểm tra phiên đăng nhập
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Nếu không có phiên đăng nhập và không phải đường dẫn công khai, chuyển hướng đến trang đăng nhập
    if (!session && !isPublicPath) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("returnUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)

    // Nếu có lỗi, cho phép truy cập để tránh chặn người dùng
    return NextResponse.next()
  }
}

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
