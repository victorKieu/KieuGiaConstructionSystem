import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Đường dẫn đến trang đăng nhập
  const loginUrl = new URL("/login", request.url)

  // Đường dẫn hiện tại
  const { pathname } = request.nextUrl

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(loginUrl)
  }

  // Nếu người dùng đã đăng nhập và đang truy cập trang đăng nhập, chuyển hướng đến dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
