import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Kiểm tra biến môi trường
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing",
    }

    // Kiểm tra kết nối Supabase
    let dbConnectionStatus = "not_tested"
    let dbError = null

    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("inventory").select("count").single()

      if (error) {
        dbConnectionStatus = "error"
        dbError = error.message
      } else {
        dbConnectionStatus = "success"
      }
    } catch (error: any) {
      dbConnectionStatus = "exception"
      dbError = error.message
    }

    return NextResponse.json({
      status: "ok",
      environment: envVars,
      database: {
        status: dbConnectionStatus,
        error: dbError,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
