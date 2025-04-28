import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Các đường dẫn công khai không cần xác thực
const publicPaths = ["/login", "/register", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra xem đường dẫn có phải là công khai không
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Nếu là đường dẫn công khai, cho phép truy cập
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Kiểm tra token từ NextAuth
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Nếu không có token, chuyển hướng đến trang đăng nhập
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(loginUrl)
  }

  // Nếu có token, cho phép truy cập
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các đường dẫn cần xác thực
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - login (login page)
     * - register (register page)
     * - api/auth (auth API)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|login|register|api/auth).*)",
  ],
}
