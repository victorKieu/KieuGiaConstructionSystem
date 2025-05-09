import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Kiểm tra biến môi trường
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Missing Supabase environment variables",
          variables: {
            supabaseUrl: !!supabaseUrl,
            supabaseKey: !!supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Trả về thông tin biến môi trường (không hiển thị giá trị thực)
    return NextResponse.json({
      status: "Environment variables available",
      variables: {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
      },
    })
  } catch (error) {
    console.error("Error in supabase-test route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
