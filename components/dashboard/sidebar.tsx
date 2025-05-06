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
  Package,
  ShoppingCart,
  BarChart,
  Settings,
  List,
  Briefcase,
  ClipboardCheck,
  Clock,
  Calendar,
  Award,
  DollarSign,
  FileText,
  LogIn,
  UserCog,
  Shield,
  Cog,
  History,
  HeartHandshake,
  LineChart,
  FileCodeIcon as FileContract,
  Database,
  CheckSquare,
  PenToolIcon as Tool,
  AlertTriangle,
  PieChartIcon as ChartPie,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isExpanded, setIsExpanded, isMobile, toggleSidebar, closeSidebar } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  // Đảm bảo component chỉ render ở client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Đóng sidebar khi chuyển trang trên mobile
  useEffect(() => {
    if (isMobile) {
      closeSidebar()
    }
  }, [pathname, isMobile, closeSidebar])

  // Xác định menu item active và mở submenu tương ứng
  useEffect(() => {
    const navItems = getNavItems()
    const activeItem = navItems.find((item) => item.active)
    if (activeItem && activeItem.subItems) {
      setActiveSubmenu(activeItem.label)
    }
  }, [pathname])

  if (!mounted) {
    return null
  }

  const handleToggleSubmenu = (label: string) => {
    setActiveSubmenu((prev) => (prev === label ? null : label))
  }

  // Tách hàm getNavItems ra để tránh tạo lại mảng mỗi khi render
  function getNavItems() {
    return [
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
            icon: List,
            label: "Danh sách dự án",
            href: "/dashboard/projects",
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
            icon: List,
            label: "Danh sách nhân viên",
            href: "/dashboard/hrm/employees",
          },
          {
            icon: Briefcase,
            label: "Quản lý tài sản",
            href: "/dashboard/hrm/assets",
          },
          {
            icon: ClipboardCheck,
            label: "Giám sát Chấm công",
            href: "/dashboard/hrm/attendance-monitoring",
          },
          {
            icon: Clock,
            label: "Chấm Công",
            href: "/dashboard/hrm/attendance",
          },
          {
            icon: Calendar,
            label: "Bảng chấm công",
            href: "/dashboard/hrm/attendance-board",
          },
          {
            icon: Calendar,
            label: "Quỹ phép",
            href: "/dashboard/hrm/leave-fund",
          },
          {
            icon: Award,
            label: "KPIs",
            href: "/dashboard/hrm/kpis",
          },
          {
            icon: DollarSign,
            label: "Bảng lương",
            href: "/dashboard/hrm/payroll",
          },
          {
            icon: FileText,
            label: "Báo cáo chấm công",
            href: "/dashboard/hrm/attendance-report",
          },
          {
            icon: LogIn,
            label: "Báo cáo Check in/out",
            href: "/dashboard/hrm/checkin-report",
          },
        ],
      },
      {
        icon: HeartHandshake,
        label: "CRM",
        href: "/dashboard/crm",
        active: pathname.startsWith("/dashboard/crm") || pathname.startsWith("/dashboard/customers"),
        subItems: [
          {
            icon: List,
            label: "Danh sách khách hàng",
            href: "/dashboard/customers",
          },
          {
            icon: LineChart,
            label: "Phân tích cơ hội",
            href: "/dashboard/crm/opportunities",
          },
          {
            icon: Users,
            label: "Chăm sóc khách hàng",
            href: "/dashboard/crm/customer-care",
          },
          {
            icon: FileContract,
            label: "Hợp Đồng",
            href: "/dashboard/crm/contracts",
          },
        ],
      },
      {
        icon: Package,
        label: "Quản lý kho",
        href: "/dashboard/inventory",
        active: pathname.startsWith("/dashboard/inventory"),
        subItems: [
          {
            icon: ChartPie,
            label: "Tổng quan kho",
            href: "/dashboard/inventory",
          },
          {
            icon: Database,
            label: "Danh mục kho",
            href: "/dashboard/inventory/materials",
          },
          {
            icon: CheckSquare,
            label: "Duyệt lệnh",
            href: "/dashboard/inventory/approvals",
          },
          {
            icon: Tool,
            label: "Lịch bảo trì",
            href: "/dashboard/inventory/maintenance",
          },
          {
            icon: AlertTriangle,
            label: "Biên bản hư hỏng",
            href: "/dashboard/inventory/damage-reports",
          },
          {
            icon: BarChart,
            label: "Báo cáo",
            href: "/dashboard/inventory/reports",
          },
        ],
      },
      {
        icon: ShoppingCart,
        label: "Mua hàng",
        href: "/dashboard/procurement",
        active: pathname.startsWith("/dashboard/procurement"),
        subItems: [
          {
            icon: Building2,
            label: "Nhà cung cấp",
            href: "/dashboard/procurement/suppliers",
          },
          {
            icon: FileText,
            label: "Yêu cầu mua hàng",
            href: "/dashboard/procurement/purchase-requests",
          },
          {
            icon: FileContract,
            label: "Hợp đồng",
            href: "/dashboard/procurement/contracts",
          },
          {
            icon: DollarSign,
            label: "Quản lý giá",
            href: "/dashboard/procurement/price-management",
          },
          {
            icon: BarChart,
            label: "Báo cáo",
            href: "/dashboard/procurement/reports",
          },
        ],
      },
      {
        icon: BarChart,
        label: "Báo cáo",
        href: "/dashboard/reports",
        active: pathname.startsWith("/dashboard/reports"),
      },
      {
        icon: Settings,
        label: "Admin",
        href: "/dashboard/admin",
        active: pathname.startsWith("/dashboard/admin"),
        subItems: [
          {
            icon: UserCog,
            label: "Quản lý người dùng",
            href: "/dashboard/admin/users",
          },
          {
            icon: Shield,
            label: "Phân quyền",
            href: "/dashboard/admin/permissions",
          },
          {
            icon: Cog,
            label: "Thiết lập hệ thống",
            href: "/dashboard/admin/settings",
          },
          {
            icon: History,
            label: "Nhật ký hệ thống",
            href: "/dashboard/admin/logs",
          },
        ],
      },
    ]
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Overlay cho mobile khi sidebar mở */}
      {isMobile && isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r z-50 transition-all duration-300 overflow-hidden",
          isMobile ? (isExpanded ? "w-64" : "w-0") : isExpanded ? "w-64" : "w-16",
          "md:relative md:z-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8">
                <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={32} height={32} />
              </div>
              <div className={cn("ml-3 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0")}>
                <h2 className="text-lg font-bold text-amber-600">Kieu Gia</h2>
                <p className="text-xs text-amber-600">Construction</p>
              </div>
            </div>
            {isMobile && isExpanded && (
              <Button variant="ghost" size="icon" onClick={closeSidebar} className="md:hidden">
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng menu</span>
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="overflow-y-auto flex-1">
            <nav className="p-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href} className="mb-1">
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => handleToggleSubmenu(item.label)}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            item.active
                              ? "bg-amber-50 text-amber-800"
                              : "text-gray-600 hover:bg-gray-100 hover:text-amber-800",
                            !isExpanded && "justify-center",
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {isExpanded && <span className="ml-3">{item.label}</span>}
                          </div>
                          {isExpanded && (
                            <svg
                              className={cn(
                                "w-4 h-4 transition-transform",
                                activeSubmenu === item.label && "transform rotate-180",
                              )}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                        {isExpanded && activeSubmenu === item.label && (
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
                                  onClick={() => isMobile && closeSidebar()}
                                >
                                  <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="ml-3">{subItem.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          item.active
                            ? "bg-amber-50 text-amber-800"
                            : "text-gray-600 hover:bg-gray-100 hover:text-amber-800",
                          !isExpanded && "justify-center",
                        )}
                        onClick={() => isMobile && closeSidebar()}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="ml-3">{item.label}</span>}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
