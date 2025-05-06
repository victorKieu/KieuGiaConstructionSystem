"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Home, FileText, Package, Users, Building, Truck, ShoppingCart, BarChart, Settings } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/projects", icon: Building, label: "Dự án" },
    { href: "/dashboard/documents", icon: FileText, label: "Tài liệu" },
    { href: "/dashboard/customers", icon: Users, label: "Khách hàng" },
    { href: "/dashboard/inventory", icon: Package, label: "Kho hàng" },
    { href: "/dashboard/equipment", icon: Truck, label: "Thiết bị" },
    { href: "/dashboard/procurement", icon: ShoppingCart, label: "Mua sắm" },
    { href: "/dashboard/reports", icon: BarChart, label: "Báo cáo" },
    { href: "/dashboard/settings", icon: Settings, label: "Cài đặt" },
  ]

  return (
    <div className="w-20 bg-white border-r flex flex-col items-center py-4">
      <div className="mb-6">
        <Link href="/dashboard">
          <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={50} height={50} />
        </Link>
      </div>
      <nav className="flex-1 w-full">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href} className="px-2">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 text-xs rounded-md",
                    isActive ? "bg-amber-50 text-amber-800" : "text-gray-500 hover:text-amber-800 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
