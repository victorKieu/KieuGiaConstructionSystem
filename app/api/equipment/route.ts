import { NextResponse } from "next/server"
import { createSafeClientOrNull } from "@/lib/supabase/safe-client"

export async function GET() {
  // Tạo Supabase client an toàn
  const supabase = createSafeClientOrNull()

  // Nếu không thể tạo client, trả về lỗi
  if (!supabase) {
    return NextResponse.json(
      {
        status: "error",
        message: "Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.",
      },
      { status: 500 },
    )
  }

  try {
    // Thực hiện truy vấn
    const { data, error } = await supabase.from("equipment").select("*")

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
