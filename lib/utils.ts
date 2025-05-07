import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy", { locale: vi })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}
