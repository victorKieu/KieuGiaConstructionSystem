import { createBrowserClient } from "@supabase/ssr"

let supabase

export function createClient() {
    if (supabase) return supabase

    supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    return supabase
}
