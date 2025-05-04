import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { email, password } = await request.json()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
            }
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            user: data.user,
            session: data.session
        })
    } catch (error) {
        console.error("[AUTH_REGISTER]", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}