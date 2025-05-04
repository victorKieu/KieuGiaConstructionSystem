import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const supabase = createClient()
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[AUTH_LOGOUT]", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}