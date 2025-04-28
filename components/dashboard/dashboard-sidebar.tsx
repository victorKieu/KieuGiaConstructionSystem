"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Dự án",
    href: "/dashboard/projects",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Nhân sự",
    href: "/dashboard/personnel",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Tài chính",
    href: "/dashboard/finance",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Kho",
    href: "/dashboard/inventory",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Nhật ký công trình",
    href: "/dashboard/construction-logs",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Tài liệu",
    href: "/dashboard/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Lịch",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
        <div className="flex items-center justify-center h-14 border-b">
          <Link href="/dashboard" className="flex items-center">
            <Home className="h-6 w-6 text-gray-700" />
            <span className="ml-2 text-lg font-semibold text-gray-700">Kieu Gia</span>
          </Link>
        </div>
        <div className="flex-grow flex flex-col mt-5">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
