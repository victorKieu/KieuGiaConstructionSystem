import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Các đường dẫn không cần xác thực
  const publicPaths = ["/login", "/api/", "/_next", "/favicon.ico"]

  // Kiểm tra xem đường dẫn hiện tại có thuộc danh sách không cần xác thực không
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path),
  )

  // Nếu là đường dẫn công khai, cho phép truy cập
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Lấy token từ cookie
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in middleware")
    // Chuyển hướng đến trang đăng nhập nếu thiếu thông tin cấu hình
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Lấy cookie từ request
  const authCookie = request.cookies.get("sb-auth-token")?.value

  if (!authCookie) {
    // Không có token, chuyển hướng đến trang đăng nhập
    const url = new URL("/login", request.url)
    url.searchParams.set("returnUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Cho phép request tiếp tục
  return NextResponse.next()
}

// Áp dụng middleware cho tất cả các đường dẫn
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
