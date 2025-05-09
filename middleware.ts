import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Danh sách các route công khai không cần xác thực
const publicRoutes = ["/login", "/api/health", "/api/supabase-check", "/api/env-check"]

export async function middleware(request: NextRequest) {
  // Lấy đường dẫn từ URL
  const path = request.nextUrl.pathname

  // Nếu đường dẫn là trang chủ, chuyển hướng đến trang đăng nhập
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Kiểm tra xem route hiện tại có trong danh sách public không
  const isPublicRoute = publicRoutes.some(
    (route) =>
      path === route || path.startsWith("/api/auth/") || path.startsWith("/_next/") || path.startsWith("/favicon.ico"),
  )

  // Nếu là public route, cho phép truy cập
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Tạo response để có thể sửa đổi cookies nếu cần
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Tạo Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      },
    )

    // Kiểm tra session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Nếu không có session và đang truy cập vào route được bảo vệ, chuyển hướng đến trang login
    if (!session) {
      const redirectUrl = new URL("/login", request.url)
      // Thêm returnUrl để sau khi đăng nhập có thể quay lại trang ban đầu
      redirectUrl.searchParams.set("returnUrl", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // Nếu có lỗi, cho phép request tiếp tục thay vì trả về lỗi 500
    return response
  }

  return response
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
