import { createClient as createClientBase } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Tạo client cho phía server
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClientBase<Database>(supabaseUrl, supabaseKey)
}
