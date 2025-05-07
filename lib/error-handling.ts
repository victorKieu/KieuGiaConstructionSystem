/**
 * Các hàm xử lý lỗi chuẩn hóa
 */

import { createServerSupabaseClient } from "./supabase/server"

/**
 * Ghi log lỗi vào console và database
 * @param error Lỗi cần ghi log
 * @param context Ngữ cảnh của lỗi
 */
export async function logError(error: Error, context?: any) {
  console.error("Error:", error.message)
  console.error("Context:", context)
  
  if (process.env.NODE_ENV === "production") {
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from("error_logs").insert({
        error_message: error.message,
        error_stack: error.stack,
        context: JSON.stringify(context),
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.error("Failed to log error to database:", logError)
    }
  }
}

/**
 * Định dạng lỗi để hiển thị cho người dùng
 * @param error Lỗi cần định dạng
 * @returns Thông báo lỗi đã định dạng
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === "string") return error
  
  if (error instanceof Error) return error.message
  
  if (error?.message) return error.message
  
  return "Đã xảy ra lỗi không xác định"
}

/**
 * Xử lý lỗi API và trả về response chuẩn
 * @param error Lỗi cần xử lý
 * @returns Object chứa thông tin lỗi
 */
export function handleApiError(error: any) {
  const errorMessage = formatErrorMessage(error)
  
  logError(error instanceof Error ? error : new Error(errorMessage), { 
    type: "api_error" 
  })
  
  return {
    status: "error",
    message: errorMessage,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Bắt và xử lý lỗi trong async function
 * @param fn Function cần bắt lỗi
 * @returns Function đã được bọc xử lý lỗi
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: any) => any
): (...args: Parameters<T>) => Promise<ReturnType<T> | { error: string }> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        functionName: fn.name,
        arguments: args,
      })
      
      if (errorHandler) {
        return errorHandler(error)
      }
      
      return { error: formatErrorMessage(error) }
    }
  }
}