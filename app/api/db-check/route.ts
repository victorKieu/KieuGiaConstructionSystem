import { NextResponse } from 'next/server'

export async function GET() {
    // Trả về phản hồi giả mà không sử dụng Supabase
    return NextResponse.json({
        status: 'ok',
        message: 'API route temporarily disabled',
        environment: process.env.VERCEL_ENV || 'development'
    })
}