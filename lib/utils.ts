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
  if (!date) return ""

  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function calculateDaysRemaining(endDate: string | Date): number {
  if (!endDate) return 0

  const end = typeof endDate === "string" ? new Date(endDate) : endDate
  const today = new Date()

  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    planning: "bg-gray-100 text-gray-800",
  }

  return statusColors[status] || "bg-gray-100 text-gray-800"
}

export function getStatusText(status: string): string {
  const statusText: Record<string, string> = {
    completed: "Hoàn thành",
    in_progress: "Đang thực hiện",
    on_hold: "Tạm dừng",
    cancelled: "Đã hủy",
    planning: "Kế hoạch",
  }

  return statusText[status] || "Không xác định"
}
