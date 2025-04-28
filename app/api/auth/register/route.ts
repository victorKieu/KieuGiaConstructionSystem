import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hash } from "bcryptjs" // Thay bcrypt bằng bcryptjs
import prisma from "@/lib/db"
import { z } from "zod"
import { cookies } from "next/headers" // Thêm import cookies từ next/headers

// Schema cho đăng ký
const registerSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    fullName: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate dữ liệu
        const validatedData = registerSchema.parse(body)
        const { username, email, password, fullName } = validatedData

        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tên đăng nhập hoặc email đã tồn tại",
                },
                { status: 400 },
            )
        }

        // Mã hóa mật khẩu
        const hashedPassword = await hash(password, 10)

        // Tạo người dùng mới
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                fullName: fullName || "",
            },
        })

        // Loại bỏ mật khẩu khỏi response
        const { password: _, ...userWithoutPassword } = newUser

        // Tạo response thành công
        const response = NextResponse.json({
            success: true,
            user: userWithoutPassword,
        })

        // Thiết lập cookie
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

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 500 },
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
