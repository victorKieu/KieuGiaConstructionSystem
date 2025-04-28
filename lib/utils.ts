import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format tiền tệ VND
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format ngày tháng theo định dạng Việt Nam
export function formatDate(date: Date | string): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Chuyển đổi trạng thái dự án sang tiếng Việt
export function getProjectStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    planning: "Lập kế hoạch",
    in_progress: "Đang thực hiện",
    on_hold: "Tạm dừng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  }
  return statusMap[status] || "Không xác định"
}

// Lấy màu cho trạng thái dự án
export function getProjectStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    planning: "bg-blue-100 text-blue-800",
    in_progress: "bg-amber-100 text-amber-800",
    on_hold: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }
  return colorMap[status] || "bg-gray-100 text-gray-800"
}

// Tạo ID ngẫu nhiên
export function generateId(prefix = ""): string {
  return `${prefix}${Math.random().toString(36).substring(2, 10)}`
}
