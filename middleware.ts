import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
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
          request.cookies.set({
            name,
            value,
            ...options,
          })
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
          return response
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
          return response
        },
      },
    },
  )

  // Kiểm tra phiên đăng nhập
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Ghi log để debug
  console.log("Middleware running for path:", request.nextUrl.pathname)
  console.log("Session exists:", !!session)

  // Nếu không có phiên đăng nhập và đang truy cập trang dashboard, chuyển hướng đến trang đăng nhập
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Redirecting to login page")
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Nếu đã đăng nhập và đang truy cập trang đăng nhập, chuyển hướng đến trang dashboard
  if (session && request.nextUrl.pathname === "/login") {
    console.log("Redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Đảm bảo middleware được áp dụng cho tất cả các đường dẫn dashboard
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/login"],
}
