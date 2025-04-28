import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { compare } from "bcryptjs" // Thay đổi từ bcrypt sang bcryptjs
import prisma from "@/lib/db"
import { z } from "zod"
import { cookies } from "next/headers" // Thêm import cookies từ next/headers

// Schema cho đăng nhập
const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate dữ liệu
        const validatedData = loginSchema.parse(body)
        const { username, password } = validatedData

        // Tìm người dùng theo username
        const user = await prisma.user.findUnique({
            where: { username },
        })

        // Nếu không tìm thấy người dùng
        if (!user) {
            return NextResponse.json({ success: false, message: "Thông tin đăng nhập không đúng" }, { status: 401 })
        }

        // Kiểm tra mật khẩu
        const passwordMatch = await compare(password, user.password)
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Thông tin đăng nhập không đúng" }, { status: 401 })
        }

        // Tạo response thành công
        const { password: _, ...userWithoutPassword } = user
        const response = NextResponse.json({
            success: true,
            user: userWithoutPassword,
        })

        // Thiết lập cookie sử dụng API mới
        cookies().set({
            name: "auth",
            value: "true",
            httpOnly: true,
            path: "/",
        })

        return response
    } catch (error) {
        console.error("Login error:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
        }

        return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 })
    }
}
