"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { isSupabaseReady } from "@/lib/supabase/client"
import { DashboardSidebar } from "../../components/dashboard/sidebar"
import { DashboardHeader } from "../../components/dashboard/header"
import { SidebarProvider } from "../../components/dashboard/sidebar-context"
import { ThemeProvider } from "../../components/theme-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClientComponentClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // Lưu URL hiện tại để redirect sau khi đăng nhập
          const returnUrl = encodeURIComponent(window.location.pathname)
          window.location.href = `/login?returnUrl=${returnUrl}`
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Hiển thị loading state khi đang kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold text-amber-600 mb-4">Đang tải...</h1>
          <p className="text-gray-700">Vui lòng đợi trong giây lát.</p>
        </div>
      </div>
    )
  }

  // Nếu không xác thực, hiển thị thông báo (redirect đã được xử lý trong useEffect)
  if (isAuthenticated === false) {
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

  // Kiểm tra xem Supabase có sẵn sàng không
  if (typeof window === "undefined" && !isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
          <DashboardSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
