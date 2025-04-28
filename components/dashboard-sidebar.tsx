"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Package,
  Users,
  Settings,
  Menu,
  BarChart3,
  Truck,
  Wrench,
  UserCircle,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      label: "Tổng quan",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Dự án",
      icon: Building2,
      href: "/dashboard/projects",
      color: "text-violet-500",
    },
    {
      label: "Nhân sự",
      icon: UserCircle,
      href: "/dashboard/personnel",
      color: "text-pink-700",
    },
    {
      label: "Nhật ký công trình",
      icon: ClipboardList,
      href: "/dashboard/construction-logs",
      color: "text-orange-500",
    },
    {
      label: "Kho vật tư",
      icon: Package,
      href: "/dashboard/inventory",
      color: "text-emerald-500",
    },
    {
      label: "Nhà cung cấp",
      icon: Truck,
      href: "/dashboard/suppliers",
      color: "text-blue-500",
    },
    {
      label: "Thiết bị",
      icon: Wrench,
      href: "/dashboard/equipment",
      color: "text-amber-500",
    },
    {
      label: "Khách hàng",
      icon: Users,
      href: "/dashboard/clients",
      color: "text-green-500",
    },
    {
      label: "Báo cáo",
      icon: BarChart3,
      href: "/dashboard/reports",
      color: "text-red-500",
    },
    {
      label: "Cài đặt",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar routes={routes} pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <div className={cn("pb-12 hidden md:block", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Kieu Gia Construction</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                    pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                    route.color,
                  )}
                >
                  <route.icon className={cn("mr-2 h-5 w-5")} />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface MobileSidebarProps {
  routes: {
    label: string
    icon: any
    href: string
    color?: string
  }[]
  pathname: string
  setOpen: (open: boolean) => void
}

function MobileSidebar({ routes, pathname, setOpen }: MobileSidebarProps) {
  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Kieu Gia Construction</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                route.color,
              )}
            >
              <route.icon className={cn("mr-2 h-5 w-5")} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
