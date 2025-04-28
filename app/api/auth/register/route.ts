import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import * as z from "zod"
import { db } from "@/lib/db"

const userSchema = z.object({
  username: z.string().min(3, {
    message: "Tên đăng nhập phải có ít nhất 3 ký tự",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .optional(),
  role: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = userSchema.parse(json)

    // Kiểm tra xem username đã tồn tại chưa
    const existingUserByUsername = await db.user.findUnique({
      where: { username: body.username },
    })

    if (existingUserByUsername) {
      return NextResponse.json({ error: "Tên đăng nhập đã tồn tại" }, { status: 400 })
    }

    // Kiểm tra xem email đã tồn tại chưa (nếu có)
    if (body.email) {
      const existingUserByEmail = await db.user.findUnique({
        where: { email: body.email },
      })

      if (existingUserByEmail) {
        return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 })
      }
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hash(body.password, 10)

    // Tạo người dùng mới
    const user = await db.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        name: body.name,
        email: body.email,
        role: body.role || "USER",
      },
    })

    // Loại bỏ mật khẩu khỏi response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Lỗi server nội bộ" }, { status: 500 })
  }
}
