import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Danh sách các đường dẫn không cần xác thực
const publicPaths = ["/", "/login", "/api/auth", "/api/maintenance", "/error"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra xem đường dẫn có nằm trong danh sách công khai không
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Nếu đường dẫn không công khai, kiểm tra xem người dùng đã đăng nhập chưa
  if (!isPublicPath) {
    // Trong môi trường production thực tế, bạn sẽ kiểm tra session ở đây
    // Nhưng hiện tại, chúng ta sẽ bỏ qua để tránh lỗi build

    // Chuyển hướng tạm thời đến trang đăng nhập
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
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
