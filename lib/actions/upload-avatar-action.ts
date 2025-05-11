"use server"

import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export async function uploadAvatarAction(formData: FormData) {
  try {
    const file = formData.get("avatar") as File

    // Kiểm tra nếu không có file
    if (!file || file.size === 0) {
      return { error: "Không có file được tải lên" }
    }

    // Kiểm tra kích thước file (giới hạn 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { error: "Kích thước file không được vượt quá 2MB" }
    }

    // Kiểm tra loại file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return { error: "Chỉ chấp nhận file hình ảnh (JPEG, PNG, WebP, GIF)" }
    }

    // Tạo Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return { error: "Thiếu biến môi trường Supabase" }
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })

    // Tạo tên file duy nhất
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}` // Đơn giản hóa đường dẫn

    // Chuyển đổi File thành ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Tải lên Supabase Storage
    const { data, error } = await supabase.storage.from("avatars").upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      console.error("Lỗi khi tải lên hình ảnh:", error)
      return { error: `Không thể tải lên hình ảnh: ${error.message}` }
    }

    // Lấy URL công khai của hình ảnh
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

    console.log("✅ Tải lên hình ảnh thành công:", publicUrlData.publicUrl)

    return {
      success: true,
      url: publicUrlData.publicUrl,
    }
  } catch (error) {
    console.error("Lỗi khi xử lý tải lên hình ảnh:", error)
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định"
    return { error: `Lỗi khi tải lên hình ảnh: ${errorMessage}` }
  }
}
