import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
    })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json(
      {
        error: "Failed to check authentication status",
      },
      { status: 500 },
    )
  }
}
