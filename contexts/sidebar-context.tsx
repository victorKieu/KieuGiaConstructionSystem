"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface SidebarContextType {
  collapsed: boolean
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleCollapsed: () => void
  expandSidebar: () => void
  resetCollapseTimer: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [collapseTimer, setCollapseTimer] = useState<NodeJS.Timeout | null>(null)

  // Hàm để thu gọn sidebar sau một khoảng thời gian
  const startCollapseTimer = useCallback(() => {
    // Xóa timer cũ nếu có
    if (collapseTimer) {
      clearTimeout(collapseTimer)
    }

    // Tạo timer mới
    const timer = setTimeout(() => {
      setCollapsed(true)
    }, 5000) // 5 giây không tương tác sẽ thu gọn sidebar

    // Lưu timer mới
    setCollapseTimer(timer)
  }, [collapseTimer]) // Thêm collapseTimer vào dependency array

  // Hàm để reset timer khi có tương tác
  const resetCollapseTimer = useCallback(() => {
    // Xóa timer cũ nếu có
    if (collapseTimer) {
      clearTimeout(collapseTimer)
      setCollapseTimer(null)
    }

    // Nếu đang thu gọn thì mở rộng
    if (collapsed) {
      setCollapsed(false)
      // Chỉ bắt đầu timer mới khi sidebar đang mở
      const timer = setTimeout(() => {
        setCollapsed(true)
      }, 5000)
      setCollapseTimer(timer)
    } else {
      // Nếu đang mở rộng thì bắt đầu timer mới
      const timer = setTimeout(() => {
        setCollapsed(true)
      }, 5000)
      setCollapseTimer(timer)
    }
  }, [collapsed, collapseTimer])

  // Hàm để mở rộng sidebar
  const expandSidebar = useCallback(() => {
    setCollapsed(false)

    // Xóa timer cũ nếu có
    if (collapseTimer) {
      clearTimeout(collapseTimer)
    }

    // Tạo timer mới
    const timer = setTimeout(() => {
      setCollapsed(true)
    }, 5000)

    setCollapseTimer(timer)
  }, [collapseTimer])

  // Hàm để toggle trạng thái thu gọn
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev)

    // Xóa timer cũ nếu có
    if (collapseTimer) {
      clearTimeout(collapseTimer)
      setCollapseTimer(null)
    }

    // Nếu đang mở rộng thì bắt đầu timer mới
    if (!collapsed) {
      const timer = setTimeout(() => {
        setCollapsed(true)
      }, 5000)
      setCollapseTimer(timer)
    }
  }, [collapsed, collapseTimer])

  // Khởi tạo timer khi component mount và cleanup khi unmount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCollapsed(true)
    }, 5000)

    setCollapseTimer(timer)

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, []) // Chỉ chạy một lần khi component mount

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleCollapsed,
        expandSidebar,
        resetCollapseTimer,
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
