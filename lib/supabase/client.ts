import { createClient as createClientBase } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Tạo client cho phía client
let supabaseClient: ReturnType<typeof createClientBase<Database>> | null = null

export const createClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  supabaseClient = createClientBase<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseClient
}
