"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Bell, Menu, X, LogOut, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={40} height={40} />
              </Link>
              <span className="ml-2 text-xl font-bold text-amber-600 hidden md:block">Kieu Gia Construction</span>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <span className="sr-only">Xem thông báo</span>
              <Bell className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Mở menu người dùng</span>
                  <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>
              </div>

              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-gray-500 text-xs">Quản trị viên</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt tài khoản
                  </Link>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Mở menu chính</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.email}</div>
                <div className="text-sm font-medium text-gray-500">Quản trị viên</div>
              </div>
              <button
                type="button"
                className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <span className="sr-only">Xem thông báo</span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="mr-2 h-5 w-5" />
                Cài đặt tài khoản
              </Link>
              <button
                className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
