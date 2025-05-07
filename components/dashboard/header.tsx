"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="bg-amber-800 text-white py-3 px-6 h-16 flex items-center justify-between">
      <h1 className="text-xl font-bold">CONSTRUCTION MANAGEMENT SYSTEM</h1>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-white hover:bg-amber-700 rounded-full"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-amber-700 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="py-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Cập nhật dự án Chung cư Kiều Gia</p>
                  <p className="text-xs text-gray-500 mt-1">Tiến độ dự án đã đạt 75%</p>
                  <p className="text-xs text-gray-400 mt-1">2 giờ trước</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Cảnh báo tồn kho</p>
                  <p className="text-xs text-gray-500 mt-1">Xi măng Portland sắp hết hàng</p>
                  <p className="text-xs text-gray-400 mt-1">5 giờ trước</p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="h-10 w-10 bg-white text-amber-800">
          <AvatarFallback>KG</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
