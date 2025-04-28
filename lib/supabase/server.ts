import { createClient as createClientBase } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { cookies } from "next/headers"

// Tạo client cho phía server
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClientBase<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Tạo client với cookie
export const createClientWithCookies = () => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClientBase<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: cookieStore.get("supabase-auth-token")?.value,
    },
  })
}
