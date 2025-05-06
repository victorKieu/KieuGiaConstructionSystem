import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Kiểm tra nếu request đến API route
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/env-check") &&
    !request.nextUrl.pathname.startsWith("/api/debug")
  ) {
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

  // Cho phép request đi tiếp
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Áp dụng middleware cho tất cả các API route
    "/api/:path*",
  ],
}
