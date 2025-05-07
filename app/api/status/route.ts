import { NextResponse } from "next/server"
import { isSupabaseReady } from "@/lib/supabase/client"

export async function GET() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
