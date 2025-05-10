import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Lấy đường dẫn từ URL
  const path = request.nextUrl.pathname

  // Nếu đường dẫn là trang chủ, chuyển hướng đến trang đăng nhập
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Bảo vệ các route dashboard và API
  if (path.startsWith("/dashboard") || path.startsWith("/api/")) {
    // Kiểm tra cookie xác thực
    const supabaseCookie = request.cookies.get("sb-auth-token")?.value

    // Nếu không có cookie xác thực, chuyển hướng đến trang đăng nhập
    if (!supabaseCookie && !path.startsWith("/api/auth")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Xử lý các route khác như bình thường
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cụ thể
export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*", "/((?!_next/static|_next/image|favicon.ico|login|public).*)"],
}
