"use client"

import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient === null) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return supabaseClient
}

// Tạo client thực hoặc client giả tùy thuộc vào môi trường
export const supabase = createClient()

// Hàm kiểm tra xem Supabase có sẵn sàng không
export function isSupabaseReady() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Hàm test kết nối Supabase an toàn
export async function testSupabaseConnection() {
  try {
    const client = createClient()
    const { data, error } = await client.from("projects").select("id").limit(1)

    if (error) {
      return {
        success: false,
        message: "Không thể kết nối đến Supabase",
        // Không trả về chi tiết lỗi trong môi trường production
        error: process.env.NODE_ENV === "development" ? error.message : "Database connection error",
      }
    }

    return {
      success: true,
      message: "Kết nối Supabase thành công",
      data: { count: data?.length || 0 },
    }
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi kiểm tra kết nối Supabase",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Internal server error",
    }
  }
}
