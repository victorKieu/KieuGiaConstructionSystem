"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"

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
    try {
      const savedPinState = localStorage.getItem("sidebarPinned")
      if (savedPinState) {
        const isPinnedValue = savedPinState === "true"
        setIsPinned(isPinnedValue)
        // Nếu đã ghim, mở sidebar
        if (isPinnedValue) {
          setIsOpen(true)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Chỉ lưu trạng thái khi component đã mount
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("sidebarPinned", isPinned.toString())
      } catch (error) {
        console.error("Error writing to localStorage:", error)
      }
    }
  }, [isPinned, isMounted])

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    // Chỉ đóng sidebar nếu không được ghim
    if (!isPinned) {
      setIsOpen(false)
    }
  }, [isPinned])

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const newValue = !prev
      // Nếu ghim, đảm bảo sidebar được mở
      if (newValue) {
        setIsOpen(true)
      }
      return newValue
    })
  }, [])

  const contextValue = useMemo<SidebarContextType>(
    () => ({
      isOpen,
      isPinned,
      toggleSidebar,
      closeSidebar,
      togglePin,
    }),
    [isOpen, isPinned, toggleSidebar, closeSidebar, togglePin],
  )

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
