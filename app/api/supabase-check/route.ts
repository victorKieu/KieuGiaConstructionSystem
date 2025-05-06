import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // Kiểm tra biến môi trường
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      {
        status: "error",
        message: "Biến môi trường Supabase chưa được cấu hình",
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Được định nghĩa" : "Không được định nghĩa",
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Được định nghĩa" : "Không được định nghĩa",
        },
      },
      { status: 500 },
    )
  }

  // Thử kết nối đến Supabase
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Thử thực hiện một truy vấn đơn giản
    const { data, error } = await supabase.from("_prisma_migrations").select("*").limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Kết nối đến Supabase thất bại",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Kết nối đến Supabase thành công",
      data: data ? "Có dữ liệu" : "Không có dữ liệu",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Lỗi khi kết nối đến Supabase",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
