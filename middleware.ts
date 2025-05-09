import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Tạm thời vô hiệu hóa middleware để tránh lỗi
export function middleware(request: NextRequest) {
  // Cho phép tất cả các request
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho một số đường dẫn cụ thể
export const config = {
  matcher: [
    // Chỉ áp dụng cho các đường dẫn dashboard
    "/dashboard/:path*",
  ],
}
