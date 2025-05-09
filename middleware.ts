import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Lấy đường dẫn từ URL
  const path = request.nextUrl.pathname

  // Nếu đường dẫn là trang chủ, chuyển hướng đến trang đăng nhập
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Bảo vệ các trang dashboard và API
  if (path.startsWith("/dashboard") || (path.startsWith("/api") && !path.startsWith("/api/auth"))) {
    // Tạo Supabase client sử dụng cookies từ request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
            // Middleware không thể set cookies
          },
          remove(name: string, options: { path: string; domain?: string }) {
            // Middleware không thể remove cookies
          },
        },
      },
    )

    // Kiểm tra session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Nếu không có session, chuyển hướng đến trang đăng nhập
    if (!session) {
      const redirectUrl = new URL("/login", request.url)
      // Thêm returnUrl để sau khi đăng nhập có thể quay lại trang ban đầu
      redirectUrl.searchParams.set("returnUrl", path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Xử lý các route khác như bình thường
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cụ thể
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - login (login page)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|login).*)",
  ],
}
