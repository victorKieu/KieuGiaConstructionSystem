"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  Home,
  Users,
  Building2,
  Plus,
  DollarSign,
  Calculator,
  ClipboardList,
  BookOpen,
  Briefcase,
  User,
} from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isExpanded, setIsExpanded, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // Đảm bảo component chỉ render ở client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false)
    }
  }

  const navItems = [
    {
      icon: Home,
      label: "Tổng quan",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: Building2,
      label: "Dự án",
      href: "/dashboard/projects",
      active: pathname.startsWith("/dashboard/projects"),
      subItems: [
        {
          icon: Plus,
          label: "Thêm dự án mới",
          href: "/dashboard/projects/new",
        },
        {
          icon: DollarSign,
          label: "Tiền lương",
          href: "/dashboard/projects/salary",
        },
        {
          icon: Calculator,
          label: "Dự toán",
          href: "/dashboard/projects/estimation",
        },
        {
          icon: ClipboardList,
          label: "Báo giá",
          href: "/dashboard/projects/quotation",
        },
        {
          icon: BookOpen,
          label: "Nhật ký công trình",
          href: "/dashboard/projects/diary",
        },
      ],
    },
    {
      icon: Users,
      label: "HRM",
      href: "/dashboard/hrm",
      active: pathname.startsWith("/dashboard/hrm"),
      subItems: [
        {
          icon: User,
          label: "Danh sách nhân viên",
          href: "/dashboard/hrm/employees",
        },
        {
          icon: Briefcase,
          label: "Quản lý tài sản",
          href: "/dashboard/hrm/assets",
        },
      ],
    },
  ]

  return (
    <div
      className={cn(
        "h-screen border-r bg-white transition-all duration-300 overflow-hidden",
        isExpanded ? "w-64" : "w-16",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8">
            <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={32} height={32} />
          </div>
          <div className={cn("ml-3 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0")}>
            <h2 className="text-lg font-bold text-amber-600">Kieu Gia</h2>
            <p className="text-xs text-amber-600">Construction</p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px-64px)]">
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    item.active ? "bg-amber-50 text-amber-800" : "text-gray-600 hover:bg-gray-100 hover:text-amber-800",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "ml-3 transition-opacity duration-300",
                      isExpanded ? "opacity-100" : "opacity-0 hidden",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>

                {item.subItems && isExpanded && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === subItem.href
                              ? "bg-amber-50 text-amber-800"
                              : "text-gray-600 hover:bg-gray-100 hover:text-amber-800",
                          )}
                        >
                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="ml-3">{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
