"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  isOpen: boolean
  isPinned: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  togglePin: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const savedPinState = localStorage.getItem("sidebarPinned")
      if (savedPinState) {
        const isPinnedValue = savedPinState === "true"
        setIsPinned(isPinnedValue)
        if (isPinnedValue) {
          setIsOpen(true)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("sidebarPinned", isPinned.toString())
      } catch (error) {
        console.error("Error writing to localStorage:", error)
      }
    }
  }, [isPinned, isMounted])

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    if (!isPinned) {
      setIsOpen(false)
    }
  }

  const togglePin = () => {
    setIsPinned((prev) => {
      const newValue = !prev
      if (newValue) {
        setIsOpen(true)
      }
      return newValue
    })
  }

  const value = {
    isOpen,
    isPinned,
    toggleSidebar,
    closeSidebar,
    togglePin,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
