"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  isOpen: boolean
  isPinned: boolean // Thêm trạng thái ghim
  toggleSidebar: () => void
  closeSidebar: () => void
  togglePin: () => void // Thêm hàm toggle pin
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false) // Khởi tạo trạng thái ghim
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Khôi phục trạng thái ghim từ localStorage
    const savedPinState = localStorage.getItem("sidebarPinned")
    if (savedPinState) {
      setIsPinned(savedPinState === "true")
      // Nếu đã ghim, mở sidebar
      if (savedPinState === "true") {
        setIsOpen(true)
      }
    }
  }, [])

  // Chỉ lưu trạng thái khi component đã mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebarPinned", isPinned.toString())
    }
  }, [isPinned, isMounted])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    // Chỉ đóng sidebar nếu không được ghim
    if (!isPinned) {
      setIsOpen(false)
    }
  }

  const togglePin = () => {
    setIsPinned(!isPinned)
    // Nếu ghim, đảm bảo sidebar được mở
    if (!isPinned) {
      setIsOpen(true)
    }
  }

  return (
    <SidebarContext.Provider value={{ isOpen, isPinned, toggleSidebar, closeSidebar, togglePin }}>
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
