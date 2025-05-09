import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware đơn giản chỉ chuyển hướng trang chủ đến trang đăng nhập
export function middleware(request: NextRequest) {
  // Chỉ áp dụng cho trang chủ
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Chỉ áp dụng cho trang chủ
export const config = {
  matcher: ["/"],
}
