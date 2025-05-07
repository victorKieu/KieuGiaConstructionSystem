import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Danh sách các API route được cho phép
    const allowedPaths = [
      "/api/auth",
      "/api/status",
      "/api/env-check",
      "/api/system-check",
      "/api/debug",
      "/api/debug-runtime",
      "/api/health",
      "/api/contact",
    ]

    // Kiểm tra nếu request đến API route và không nằm trong danh sách cho phép
    if (request.nextUrl.pathname.startsWith("/api/")) {
      // Kiểm tra xem path có nằm trong danh sách cho phép không
      const isAllowed = allowedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

      if (!isAllowed) {
        // Chuyển hướng đến route status
        return NextResponse.rewrite(new URL("/api/status", request.url))
      }
    }

    // Cho phép request đi tiếp
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Trong trường hợp lỗi, cho phép request tiếp tục
    return NextResponse.next()
  }
}

// Chỉ áp dụng middleware cho các route API
export const config = {
  matcher: ["/api/:path*"],
}
