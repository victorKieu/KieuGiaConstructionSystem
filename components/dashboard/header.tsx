"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

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
    <header className="bg-amber-800 text-white py-3 px-6">
      <div className="flex justify-between items-center">
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
          <Button
            variant="ghost"
            className="bg-white text-amber-800 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center"
          >
            KG
          </Button>
        </div>
      </div>
    </header>
  )
}
