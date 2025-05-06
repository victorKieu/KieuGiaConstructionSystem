"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  Briefcase,
  Settings,
  Package,
  Truck,
  FileText,
  BarChart3,
  UserCircle,
  Pin,
  PinOff,
  X,
} from "lucide-react"
import Image from "next/image"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

// Định nghĩa kiểu dữ liệu cho các mục menu
type SubMenuItem = {
  title: string
  href: string
  icon?: React.ElementType
}

type MenuItem = {
  title: string
  href?: string
  icon: React.ElementType
  submenu?: SubMenuItem[]
}

// Danh sách các mục menu
const navItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Dự án",
    href: "/dashboard/projects",
    icon: Briefcase,
  },
  {
    title: "Khách hàng",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Kho",
    icon: Package,
    submenu: [
      {
        title: "Tổng quan",
        href: "/dashboard/inventory/overview",
      },
      {
        title: "Vật tư",
        href: "/dashboard/inventory",
      },
      {
        title: "Thiết bị",
        href: "/dashboard/equipment",
      },
    ],
  },
  {
    title: "Nhân sự",
    icon: UserCircle,
    href: "/dashboard/hrm",
  },
  {
    title: "Mua hàng",
    icon: Truck,
    submenu: [
      {
        title: "Nhà cung cấp",
        href: "/dashboard/procurement/suppliers",
      },
      {
        title: "Yêu cầu mua hàng",
        href: "/dashboard/procurement/purchase-requests",
      },
      {
        title: "Hợp đồng",
        href: "/dashboard/procurement/contracts",
      },
      {
        title: "Quản lý giá",
        href: "/dashboard/procurement/price-management",
      },
      {
        title: "Báo cáo",
        href: "/dashboard/procurement/reports",
      },
    ],
  },
  {
    title: "Báo cáo",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Tài liệu",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isOpen, isPinned, toggleSidebar, togglePin } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Kiểm tra xem pathname có match với href không
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Mở submenu nếu đường dẫn hiện tại thuộc submenu đó
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some((subItem) => isActive(subItem.href))
        if (isSubmenuActive) {
          setOpenSubmenu(item.title)
        }
      }
    })
  }, [pathname])

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <>
      {/* Overlay cho mobile */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:z-0",
          isPinned ? "lg:translate-x-0" : "lg:w-20 lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className={cn("relative", isPinned ? "w-10 h-10" : "w-8 h-8 lg:w-10 lg:h-10")}>
              <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" fill className="object-contain" />
            </div>
            <span
              className={cn(
                "font-bold text-xl transition-opacity duration-200",
                isPinned ? "opacity-100" : "lg:opacity-0",
              )}
            >
              Kiều Gia
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {/* Nút ghim chỉ hiển thị trên desktop */}
            <button
              onClick={togglePin}
              className="hidden lg:flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={isPinned ? "Bỏ ghim sidebar" : "Ghim sidebar"}
            >
              {isPinned ? <PinOff className="h-5 w-5 text-gray-500" /> : <Pin className="h-5 w-5 text-gray-500" />}
            </button>

            {/* Nút đóng chỉ hiển thị trên mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Đóng sidebar"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <nav className="mt-2 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.title}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                        openSubmenu === item.title && "bg-gray-100 dark:bg-gray-800",
                      )}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span
                        className={cn(
                          "flex-1 transition-opacity duration-200",
                          isPinned ? "opacity-100" : "lg:opacity-0",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn("transition-opacity duration-200", isPinned ? "opacity-100" : "lg:opacity-0")}
                      >
                        {openSubmenu === item.title ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                    {openSubmenu === item.title && (
                      <ul
                        className={cn(
                          "mt-1 space-y-1 pl-8",
                          !isPinned &&
                            "lg:absolute lg:left-full lg:top-0 lg:ml-2 lg:w-48 lg:rounded-md lg:bg-white lg:p-2 lg:shadow-lg lg:dark:bg-gray-900",
                        )}
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                                isActive(subItem.href) &&
                                  "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                              )}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                      isActive(item.href || "") &&
                        "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                    )}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span className={cn("transition-opacity duration-200", isPinned ? "opacity-100" : "lg:opacity-0")}>
                      {item.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
