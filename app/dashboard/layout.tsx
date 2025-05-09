import type React from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-amber-600">Kieu Gia Construction</h1>
          <Link href="/login" className="text-amber-600 hover:text-amber-800">
            Đăng xuất
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}
