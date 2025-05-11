import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    return NextResponse.json({
      authenticated: !!session,
      session: session
        ? {
            user: {
              id: session.user.id,
              email: session.user.email,
            },
            expires_at: session.expires_at,
          }
        : null,
      cookies: Object.fromEntries(
        // Lọc ra các cookie liên quan đến Supabase
        Object.entries(
          Object.fromEntries(
            new Map(
              Array.from(
                // @ts-ignore - Sử dụng headers().getAll() để lấy tất cả cookie
                new Headers({ cookie: headers().get("cookie") || "" }).entries(),
              ),
            ),
          ),
        ).filter(([key]) => key.includes("supabase")),
      ),
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json(
      {
        error: "Failed to check authentication",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
