import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Bỏ qua các route không cần xác thực
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/api/health" ||
    request.nextUrl.pathname === "/fallback-login"
  ) {
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

    // Kiểm tra nếu route bắt đầu bằng /dashboard hoặc /api (trừ các API auth và health)
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      (request.nextUrl.pathname.startsWith("/api") &&
        !request.nextUrl.pathname.startsWith("/api/auth") &&
        !request.nextUrl.pathname.startsWith("/api/health"))
    ) {
      // Kiểm tra session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Nếu không có session, chuyển hướng đến trang login
      if (!session) {
        const redirectUrl = new URL("/login", request.url)
        // Thêm returnUrl để sau khi đăng nhập có thể quay lại trang ban đầu
        redirectUrl.searchParams.set("returnUrl", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
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
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
