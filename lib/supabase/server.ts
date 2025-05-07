import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies()

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          get: (name) => {
            try {
              return cookieStore.get(name)?.value
            } catch (error) {
              console.error("Error getting cookie:", error)
              return undefined
            }
          },
          set: (name, value, options) => {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              console.error("Error setting cookie:", error)
            }
          },
          remove: (name, options) => {
            try {
              cookieStore.set(name, "", { ...options, maxAge: 0 })
            } catch (error) {
              console.error("Error removing cookie:", error)
            }
          },
        },
      },
    )
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}
