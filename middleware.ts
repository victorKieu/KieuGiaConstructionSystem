import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  // Tạo Supabase client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Kiểm tra session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Nếu không có session và đang truy cập trang dashboard, chuyển hướng đến trang login
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Nếu có session và đang truy cập trang login, chuyển hướng đến trang dashboard
  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return res
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
