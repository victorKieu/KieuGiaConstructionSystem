"use server"

import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"

export async function uploadAvatarAction(formData: FormData) {
    try {
        const supabase = createClient()
        const file = formData.get("avatar") as File

        if (!file) {
            return { success: false, error: "Không tìm thấy file" }
        }

        // Tạo tên file duy nhất
        const fileExt = file.name.split(".").pop()
        const fileName = `${randomUUID()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        // Upload file lên Supabase Storage
        const { error: uploadError } = await supabase.storage.from("employees").upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        })

        if (uploadError) {
            console.error("Error uploading avatar:", uploadError)
            return { success: false, error: uploadError.message }
        }

        // Lấy URL công khai của file
        const { data } = supabase.storage.from("employees").getPublicUrl(filePath)

        return {
            success: true,
            url: data.publicUrl,
            path: filePath,
        }
    } catch (error) {
        console.error("Error in uploadAvatarAction:", error)
        return { success: false, error: "Đã xảy ra lỗi khi tải lên ảnh đại diện" }
    }
}
