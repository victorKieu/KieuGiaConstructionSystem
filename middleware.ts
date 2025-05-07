import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Kiểm tra nếu request là đến API route (ngoại trừ auth và các route cụ thể khác)
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/auth/") &&
    !request.nextUrl.pathname.startsWith("/api/maintenance/") &&
    !request.nextUrl.pathname.startsWith("/api/env-check/") &&
    !request.nextUrl.pathname.startsWith("/api/system-check/")
  ) {
    // Trả về response bảo trì
    return NextResponse.json(
      {
        status: "maintenance",
        message: "API đang được bảo trì. Vui lòng thử lại sau.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }

  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route API
export const config = {
  matcher: "/api/:path*",
}
