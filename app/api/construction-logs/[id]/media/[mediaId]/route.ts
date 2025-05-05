import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = createClient()

        // Lấy dữ liệu từ Supabase
        const { data, error } = await supabase
            .from('construction_logs')
            .select('*')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("[CONSTRUCTION_LOGS_GET]", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const body = await request.json()

        // Thêm dữ liệu vào Supabase
        const { data, error } = await supabase
            .from('construction_logs')
            .insert(body)
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("[CONSTRUCTION_LOGS_POST]", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}