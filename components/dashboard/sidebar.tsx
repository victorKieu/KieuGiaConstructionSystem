"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Package, Truck, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Dự án", icon: Building2 },
    { href: "/dashboard/inventory", label: "Kho hàng", icon: Package },
    { href: "/dashboard/equipment", label: "Thiết bị", icon: Truck },
    { href: "/dashboard/users", label: "Người dùng", icon: Users },
    { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Kiều Gia</h1>
        <p className="text-sm text-gray-600">Quản lý xây dựng</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100",
                pathname === item.href && "bg-gray-100 text-indigo-600 font-medium",
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
