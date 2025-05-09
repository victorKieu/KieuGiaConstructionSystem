import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    planning: "bg-blue-100 text-blue-800",
    in_progress: "bg-green-100 text-green-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    completed: "bg-teal-100 text-teal-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return statusColors[status] || "bg-gray-100 text-gray-800"
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    planning: "Kế hoạch",
    in_progress: "Đang thực hiện",
    on_hold: "Tạm dừng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  }

  return statusMap[status] || status
}

export function calculateDaysRemaining(endDate: string | Date): number {
  const end = new Date(endDate)
  const today = new Date()

  // Đặt thời gian về 00:00:00 để so sánh chỉ ngày
  end.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
