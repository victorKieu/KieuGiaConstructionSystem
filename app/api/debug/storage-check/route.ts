import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Tạo Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Thiếu biến môi trường Supabase" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })

    // Kiểm tra danh sách buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json({ error: `Lỗi khi lấy danh sách buckets: ${bucketsError.message}` }, { status: 500 })
    }

    // Kiểm tra bucket avatars
    const avatarsBucket = buckets.find((bucket) => bucket.name === "avatars")

    if (!avatarsBucket) {
      return NextResponse.json({ error: "Không tìm thấy bucket 'avatars'" }, { status: 404 })
    }

    // Kiểm tra quyền truy cập bucket
    const { data: objects, error: objectsError } = await supabase.storage.from("avatars").list()

    return NextResponse.json({
      success: true,
      buckets,
      avatarsBucket,
      objects: objects || [],
      objectsError: objectsError ? objectsError.message : null,
    })
  } catch (error) {
    console.error("Lỗi khi kiểm tra Supabase Storage:", error)
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định"
    return NextResponse.json({ error: `Lỗi khi kiểm tra Supabase Storage: ${errorMessage}` }, { status: 500 })
  }
}
