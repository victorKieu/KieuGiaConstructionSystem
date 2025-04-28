import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { isActive } = await request.json()

    // Kiểm tra người dùng tồn tại
    const existingUser = await sql`
      SELECT id FROM "User" WHERE id = ${id}
    `

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Cập nhật trạng thái
    const updatedUser = await sql`
      UPDATE "User"
      SET "isActive" = ${isActive}, "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, username, name, email, phone, role, department, position, "isActive"
    `

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
