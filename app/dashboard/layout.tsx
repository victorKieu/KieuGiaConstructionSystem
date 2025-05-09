import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { Suspense } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Kiểm tra xác thực
  const cookieStore = cookies()

  try {
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

    // Nếu không có session, chuyển hướng đến trang đăng nhập
    if (!session) {
      redirect("/login?returnUrl=/dashboard")
    }

    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                <Suspense fallback={<div className="p-4">Đang tải...</div>}>{children}</Suspense>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    )
  } catch (error) {
    console.error("Error in dashboard layout:", error)
    // Nếu có lỗi, hiển thị thông báo lỗi thay vì chuyển hướng
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi xác thực</h1>
          <p className="text-gray-700 mb-4">Không thể xác thực người dùng. Vui lòng thử đăng nhập lại.</p>
          <a
            href="/login"
            className="block w-full text-center py-2 px-4 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Quay lại trang đăng nhập
          </a>
        </div>
      </div>
    )
  }
}
