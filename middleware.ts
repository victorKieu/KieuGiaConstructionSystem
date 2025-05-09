import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Chỉ chuyển hướng trang chủ đến trang đăng nhập
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Cho phép tất cả các request khác đi qua
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho trang chủ
export const config = {
  matcher: ["/"],
}
