import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hash } from "bcryptjs" // Thay đổi từ bcrypt sang bcryptjs
import prisma from "@/lib/db"
import { z } from "zod"
import { cookies } from "next/headers" // Thêm import cookies từ next/headers

// Schema cho đăng ký
const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate dữ liệu
        const validatedData = registerSchema.parse(body)
        const { username, email, password } = validatedData

        // Kiểm tra username đã tồn tại chưa
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username hoặc email đã tồn tại",
                },
                { status: 400 },
            )
        }

        // Hash mật khẩu
        const hashedPassword = await hash(password, 10)

        // Tạo người dùng mới
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        })

        // Tạo response thành công
        const { password: _, ...userWithoutPassword } = newUser
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
        console.error("Register error:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    details: error.errors,
                },
                { status: 400 },
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "Lỗi server",
            },
            { status: 500 },
        )
    }
}
