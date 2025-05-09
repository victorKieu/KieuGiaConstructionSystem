import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials in server context")
    throw new Error("Missing Supabase credentials")
  }

  // Create a Supabase client with the service role key for server-side operations
  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
