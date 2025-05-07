"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
  isMobile: boolean
  isMobileOpen: boolean
  setIsMobileOpen: (value: boolean) => void
  toggleMobileMenu: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Kiểm tra kích thước màn hình khi component được mount
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Trên mobile, mặc định sidebar sẽ thu gọn
      if (mobile) {
        setIsExpanded(false)
      }
    }

    // Kiểm tra kích thước ban đầu
    checkScreenSize()

    // Thêm event listener để kiểm tra khi resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        isMobile,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobileMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
