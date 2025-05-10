import { createClient } from "./supabase/server"
import type { NextRequest } from "next/server"

// Kiểm tra xác thực người dùng
export async function isAuthenticated(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

// Kiểm tra quyền truy cập
export async function hasPermission(userId: string, resource: string, action: string) {
  try {
    const supabase = createClient()

    // Kiểm tra quyền trong bảng permissions (giả định)
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .eq("user_id", userId)
      .eq("resource", resource)
      .eq("action", action)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}

// Mã hóa dữ liệu nhạy cảm (ví dụ: ID)
export function encodeId(id: number | string): string {
  // Đơn giản hóa: Trong thực tế, bạn nên sử dụng thuật toán mã hóa mạnh hơn
  return Buffer.from(`${id}-${Date.now()}`).toString("base64")
}

// Giải mã ID
export function decodeId(encoded: string): string | null {
  try {
    const decoded = Buffer.from(encoded, "base64").toString()
    return decoded.split("-")[0]
  } catch (error) {
    console.error("Error decoding ID:", error)
    return null
  }
}

// Tạo CSRF token
export function generateCsrfToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Xóa thông tin nhạy cảm từ dữ liệu trước khi gửi đến client
export function sanitizeData(data: any): any {
  if (!data) return data

  // Nếu là mảng, xử lý từng phần tử
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item))
  }

  // Nếu là object, xóa các trường nhạy cảm
  if (typeof data === "object") {
    const sanitized = { ...data }

    // Danh sách các trường nhạy cảm cần xóa
    const sensitiveFields = ["password", "password_hash", "secret", "token", "api_key", "private_key", "credit_card"]

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        delete sanitized[field]
      }
    })

    // Xử lý đệ quy cho các trường con
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
        sanitized[key] = sanitizeData(sanitized[key])
      }
    })

    return sanitized
  }

  return data
}
