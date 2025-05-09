import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in supabase-check API:", error)
    return NextResponse.json({ success: false, error: "Unexpected error in API route" }, { status: 500 })
  }
}
