"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Truck,
  FileText,
  ShoppingCart,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: {
    title: string
    href: string
  }[]
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems: NavItem[] = [
    {
      title: "Tổng quan",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Dự án",
      href: "/dashboard",
      icon: Building2,
      submenu: [
        { title: "Danh sách dự án", href: "/dashboard" },
        { title: "Tiến độ dự án", href: "/dashboard/projects/timeline" },
        { title: "Vấn đề dự án", href: "/dashboard/projects/issues" },
      ],
    },
    {
      title: "Khách hàng",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Kho & Vật tư",
      href: "/dashboard/inventory",
      icon: Package,
      submenu: [
        { title: "Danh mục vật tư", href: "/dashboard/inventory/materials" },
        { title: "Quản lý kho", href: "/dashboard/inventory/warehouses" },
        { title: "Nhập/Xuất kho", href: "/dashboard/inventory/transactions" },
        { title: "Yêu cầu vật tư", href: "/dashboard/inventory/requests" },
        { title: "Nhà cung cấp", href: "/dashboard/inventory/suppliers" },
      ],
    },
    {
      title: "Nhân sự",
      href: "/dashboard/hrm",
      icon: Users,
      submenu: [
        { title: "Danh sách nhân viên", href: "/dashboard/hrm/employees" },
        { title: "Chấm công", href: "/dashboard/hrm/attendance" },
        { title: "Quản lý tài sản", href: "/dashboard/hrm/assets" },
      ],
    },
    {
      title: "Thiết bị",
      href: "/dashboard/equipment",
      icon: Truck,
    },
    {
      title: "Dự toán & Báo giá",
      href: "/dashboard/estimation",
      icon: FileText,
    },
    {
      title: "Mua sắm",
      href: "/dashboard/procurement",
      icon: ShoppingCart,
    },
    {
      title: "Cài đặt",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Kiều Gia</h1>
        <p className="text-sm text-gray-600">Quản lý xây dựng</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const isSubmenuOpen = openSubmenu === item.title

          return (
            <div key={item.href} className="space-y-1">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100",
                      isActive && "bg-gray-100 text-indigo-600 font-medium",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </div>
                    <ChevronDown
                      className={cn("w-4 h-4 transition-transform", isSubmenuOpen && "transform rotate-180")}
                    />
                  </button>
                  {isSubmenuOpen && (
                    <div className="pl-10 space-y-1 mt-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100",
                            pathname === subitem.href && "bg-gray-100 text-indigo-600 font-medium",
                          )}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100",
                    isActive && "bg-gray-100 text-indigo-600 font-medium",
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              )}
            </div>
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
