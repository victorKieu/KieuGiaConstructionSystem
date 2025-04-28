import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const position = await sql`
      SELECT id, name, description, "createdAt", "updatedAt"
      FROM "Position"
      WHERE id = ${id}
    `

    if (position.length === 0) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    return NextResponse.json(position[0])
  } catch (error) {
    console.error("Error fetching position:", error)
    return NextResponse.json({ error: "Failed to fetch position" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { name, description } = body

    // Kiểm tra chức vụ tồn tại
    const existingPosition = await sql`
      SELECT id FROM "Position" WHERE id = ${id}
    `

    if (existingPosition.length === 0) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Cập nhật chức vụ
    const updatedPosition = await sql`
      UPDATE "Position"
      SET 
        name = ${name},
        description = ${description || null},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, name, description, "createdAt", "updatedAt"
    `

    return NextResponse.json(updatedPosition[0])
  } catch (error) {
    console.error("Error updating position:", error)
    return NextResponse.json({ error: "Failed to update position" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Kiểm tra chức vụ tồn tại
    const existingPosition = await sql`
      SELECT id FROM "Position" WHERE id = ${id}
    `

    if (existingPosition.length === 0) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Xóa chức vụ
    await sql`
      DELETE FROM "Position"
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json({ error: "Failed to delete position" }, { status: 500 })
  }
}
