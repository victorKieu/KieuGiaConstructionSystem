"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type SidebarContextType = {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Kiểm tra kích thước màn hình và cập nhật trạng thái
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
      }
    }

    // Kiểm tra khi component mount
    checkMobile()

    // Thêm event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Hàm toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Hàm đóng sidebar
  const closeSidebar = useCallback(() => {
    setIsExpanded(false)
  }, [])

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded, isMobile, toggleSidebar, closeSidebar }}>
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
