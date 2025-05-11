import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Tạo response mới để có thể sửa đổi cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Tạo Supabase client với cookies từ request và response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Khi Supabase đặt cookie, cập nhật cả request và response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Khi Supabase xóa cookie, cập nhật cả request và response
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  // Kiểm tra phiên đăng nhập
  const { data } = await supabase.auth.getSession()
  const session = data?.session

  // Đường dẫn hiện tại
  const path = request.nextUrl.pathname

  // Nếu không có phiên đăng nhập và đang truy cập trang dashboard, chuyển hướng đến trang đăng nhập
  if (!session && path.startsWith("/dashboard")) {
    // Tạo URL chuyển hướng đến trang đăng nhập
    const redirectUrl = new URL("/login", request.url)

    // Lưu đường dẫn hiện tại để sau khi đăng nhập có thể quay lại
    redirectUrl.searchParams.set("redirect", path)

    // Chuyển hướng đến trang đăng nhập
    return NextResponse.redirect(redirectUrl)
  }

  // Nếu đã đăng nhập và đang truy cập trang đăng nhập, chuyển hướng đến trang dashboard
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Trả về response đã được cập nhật
  return response
}

// Đảm bảo middleware được áp dụng cho tất cả các đường dẫn cần bảo vệ
export const config = {
  matcher: [
    // Áp dụng cho tất cả các đường dẫn dashboard
    "/dashboard",
    "/dashboard/:path*",
    // Áp dụng cho trang đăng nhập
    "/login",
  ],
}
