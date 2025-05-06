"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isOpen: boolean
  isHovering: boolean
  toggle: () => void
  setIsHovering: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  // Kiểm tra kích thước màn hình khi component được mount
  useEffect(() => {
    const checkScreenSize = () => {
      setIsOpen(window.innerWidth >= 1024) // Mặc định mở rộng trên màn hình lớn
    }

    // Kiểm tra kích thước ban đầu
    checkScreenSize()

    // Thêm event listener để kiểm tra khi resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggle = () => {
    setIsOpen(!isOpen)
    // Reset hovering state when toggling
    if (isOpen) {
      setIsHovering(false)
    }
  }

  return (
    <SidebarContext.Provider value={{ isOpen, isHovering, toggle, setIsHovering }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
