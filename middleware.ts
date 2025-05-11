import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Lấy đường dẫn từ URL
  const path = request.nextUrl.pathname

  // Nếu đường dẫn là trang chủ, chuyển hướng đến trang đăng nhập
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Xử lý các route khác như bình thường
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cụ thể
export const config = {
  matcher: ["/", "/api/:path*"],
}
