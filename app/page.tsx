import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export const dynamic = "force-dynamic"

export default async function Home() {
  try {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Nếu người dùng đã đăng nhập, chuyển hướng đến trang dashboard
    if (session) {
      return redirect("/dashboard")
    }

    // Nếu không, chuyển hướng đến trang login
    return redirect("/login")
  } catch (error) {
    console.error("Error in Home page:", error)
    // Nếu có lỗi, hiển thị trang chào mừng đơn giản thay vì redirect
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Kieu Gia Construction</h1>
        <p className="mb-8">Hệ thống quản lý xây dựng toàn diện</p>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
            Đăng nhập
          </a>
        </div>
      </div>
    )
  }
}
