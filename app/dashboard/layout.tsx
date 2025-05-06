import type React from "react"
import { isSupabaseReady } from "@/lib/supabase/client"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex min-h-screen flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <h1 className="text-xl font-bold">Kieu Gia Construction Management</h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto text-center text-gray-600">
          &copy; {new Date().getFullYear()} Kieu Gia Construction
        </div>
      </footer>
    </div>
  )
}
