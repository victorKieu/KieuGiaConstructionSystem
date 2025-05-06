import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Danh sách các API route cần bỏ qua
  const excludedPaths = ["/api/auth", "/api/env-check", "/api/system-check"]

  // Kiểm tra nếu request đến API route và không nằm trong danh sách bỏ qua
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Kiểm tra xem path có nằm trong danh sách bỏ qua không
    const shouldExclude = excludedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (!shouldExclude) {
      // Trả về phản hồi bảo trì
      return NextResponse.json(
        {
          status: "maintenance",
          message: "API đang được bảo trì. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  }

  // Cho phép request đi tiếp
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Áp dụng middleware cho tất cả các API route
    "/api/:path*",
  ],
}
