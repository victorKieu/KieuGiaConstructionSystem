import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const department = await sql`
      SELECT id, name, description, "createdAt", "updatedAt"
      FROM "Department"
      WHERE id = ${id}
    `

    if (department.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json(department[0])
  } catch (error) {
    console.error("Error fetching department:", error)
    return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { name, description } = body

    // Kiểm tra phòng ban tồn tại
    const existingDepartment = await sql`
      SELECT id FROM "Department" WHERE id = ${id}
    `

    if (existingDepartment.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Cập nhật phòng ban
    const updatedDepartment = await sql`
      UPDATE "Department"
      SET 
        name = ${name},
        description = ${description || null},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, name, description, "createdAt", "updatedAt"
    `

    return NextResponse.json(updatedDepartment[0])
  } catch (error) {
    console.error("Error updating department:", error)
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Kiểm tra phòng ban tồn tại
    const existingDepartment = await sql`
      SELECT id FROM "Department" WHERE id = ${id}
    `

    if (existingDepartment.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Xóa phòng ban
    await sql`
      DELETE FROM "Department"
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting department:", error)
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
  }
}
