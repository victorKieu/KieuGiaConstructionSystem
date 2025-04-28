"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"

interface DashboardHeaderProps {
  title?: string
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  const { setMobileSidebarOpen } = useSidebar()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setMobileSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="h-9 w-[200px] rounded-md border border-gray-200 bg-white pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
        )}

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Thông báo</span>
        </Button>

        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Hồ sơ</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
