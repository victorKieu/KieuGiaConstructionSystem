"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./sidebar-context"
import { createClient } from "@/lib/supabase/client"

export function DashboardHeader() {
  const router = useRouter()
  const { toggleSidebar, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    const fetchUserProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.email?.split("@")[0] || "User")
      }
    }

    fetchUserProfile()
  }, [])

  if (!mounted) return null

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input type="search" placeholder="Tìm kiếm..." className="pl-8 h-9 w-full bg-gray-50 border-gray-200" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Thông báo</span>
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline-block">{userName || "User"}</span>
        </div>
      </div>
    </header>
  )
}
