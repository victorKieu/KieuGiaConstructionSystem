"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Truck,
  Settings,
  ChevronDown,
  ChevronRight,
  HardHatIcon as UserHardHat,
  FileText,
  BarChart3,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
  expanded?: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>([
    {
      title: "Tổng quan",
      href: "/dashboard/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Dự án",
      href: "/dashboard/projects",
      icon: <Building2 className="h-5 w-5" />,
      submenu: [
        {
          title: "Danh sách dự án",
          href: "/dashboard/projectlist",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Tạo dự án mới",
          href: "/dashboard/projects/create",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Khách hàng",
      href: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        {
          title: "Danh sách khách hàng",
          href: "/dashboard/customers",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Thống kê khách hàng",
          href: "/dashboard/customers/overview",
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Nhân sự",
      href: "/dashboard/hrm",
      icon: <UserHardHat className="h-5 w-5" />,
      submenu: [
        {
          title: "Tổng quan nhân sự",
          href: "/dashboard/hrm",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Danh sách nhân viên",
          href: "/dashboard/hrm/employees",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Chấm công",
          href: "/dashboard/hrm/attendance",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "KPI & Đánh giá",
          href: "/dashboard/hrm/kpi",
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Kho vật tư",
      href: "/dashboard/inventory",
      icon: <Package className="h-5 w-5" />,
      submenu: [
        {
          title: "Tổng quan kho",
          href: "/dashboard/inventory/overview",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Mua sắm & Cung ứng",
      href: "/dashboard/procurement",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Cài đặt",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ])

  // Tự động mở rộng menu dựa trên đường dẫn hiện tại
  useEffect(() => {
    setNavItems((prevItems) =>
      prevItems.map((item) => {
        if (item.submenu) {
          const isActive = item.submenu.some((subItem) => pathname.startsWith(subItem.href))
          return { ...item, expanded: isActive }
        }
        return item
      }),
    )
  }, [pathname])

  const toggleSubmenu = (index: number) => {
    setNavItems((prevItems) =>
      prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, expanded: !item.expanded }
        }
        return item
      }),
    )
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`bg-white shadow-sm transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} min-h-screen`}>
      <div className="p-4 border-b flex justify-between items-center">
        {!isCollapsed && <h2 className="font-semibold text-gray-800">Menu</h2>}
        <button onClick={toggleSidebar} className={`p-1 rounded-md hover:bg-gray-100 ${isCollapsed ? "mx-auto" : ""}`}>
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`w-full flex items-center p-2 rounded-md hover:bg-amber-50 ${
                      pathname.startsWith(item.href) ? "bg-amber-50 text-amber-600" : "text-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </>
                    )}
                  </button>
                  {item.expanded && !isCollapsed && (
                    <ul className="pl-10 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center p-2 rounded-md hover:bg-amber-50 ${
                              pathname === subItem.href ? "bg-amber-50 text-amber-600" : "text-gray-700"
                            }`}
                          >
                            <span className="mr-3">{subItem.icon}</span>
                            <span>{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md hover:bg-amber-50 ${
                    pathname === item.href ? "bg-amber-50 text-amber-600" : "text-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

// Thêm icon ChevronLeft
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
