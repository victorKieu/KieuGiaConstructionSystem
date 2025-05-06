import { NextResponse } from "next/server"

export async function GET() {
    // Lấy các biến môi trường cần kiểm tra
    const envVariables = {
        // Biến môi trường Supabase
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Không được định nghĩa",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "Được định nghĩa (giá trị được ẩn)"
            : "Không được định nghĩa",

        // Biến môi trường NextAuth
        nextAuthUrl: process.env.NEXTAUTH_URL || "Không được định nghĩa",
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? "Được định nghĩa (giá trị được ẩn)" : "Không được định nghĩa",

        // Biến môi trường Vercel
        vercelEnv: process.env.VERCEL_ENV || "Không được định nghĩa",
        nodeEnv: process.env.NODE_ENV || "Không được định nghĩa",
        vercel: process.env.VERCEL ? "Được định nghĩa" : "Không được định nghĩa",

        // Thông tin về môi trường
        isProduction: process.env.NODE_ENV === "production",
        isVercel: !!process.env.VERCEL,
    }

    // Trả về thông tin dưới dạng JSON
    return NextResponse.json({
        status: "success",
        timestamp: new Date().toISOString(),
        environment: envVariables,
    })
}
