import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const member = await sql`
      SELECT 
        pm.id, 
        pm."projectId", 
        pm."userId", 
        pm.role, 
        pm."startDate", 
        pm."endDate",
        p.code as "projectCode",
        p.name as "projectName",
        u.name as "userName",
        u.position as "userPosition",
        u.avatar as "userAvatar"
      FROM "ProjectMember" pm
      JOIN "Project" p ON pm."projectId" = p.id
      JOIN "User" u ON pm."userId" = u.id
      WHERE pm.id = ${id}
    `

    if (member.length === 0) {
      return NextResponse.json({ error: "Project member not found" }, { status: 404 })
    }

    // Chuyển đổi dữ liệu để phù hợp với cấu trúc mong muốn
    const formattedMember = {
      id: member[0].id,
      projectId: member[0].projectId,
      userId: member[0].userId,
      role: member[0].role,
      startDate: member[0].startDate,
      endDate: member[0].endDate,
      project: {
        id: member[0].projectId,
        code: member[0].projectCode,
        name: member[0].projectName,
      },
      user: {
        id: member[0].userId,
        name: member[0].userName,
        position: member[0].userPosition,
        avatar: member[0].userAvatar,
      },
    }

    return NextResponse.json(formattedMember)
  } catch (error) {
    console.error("Error fetching project member:", error)
    return NextResponse.json({ error: "Failed to fetch project member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { role, startDate, endDate } = body

    // Kiểm tra phân công tồn tại
    const existingMember = await sql`
      SELECT id FROM "ProjectMember" WHERE id = ${id}
    `

    if (existingMember.length === 0) {
      return NextResponse.json({ error: "Project member not found" }, { status: 404 })
    }

    // Cập nhật phân công
    const updatedMember = await sql`
      UPDATE "ProjectMember"
      SET 
        role = ${role},
        "startDate" = ${new Date(startDate)},
        "endDate" = ${endDate ? new Date(endDate) : null},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, "projectId", "userId", role, "startDate", "endDate"
    `

    // Lấy thông tin chi tiết về dự án và người dùng
    const memberDetails = await sql`
      SELECT 
        pm."projectId", 
        pm."userId"
      FROM "ProjectMember" pm
      WHERE pm.id = ${id}
    `

    const projectId = memberDetails[0].projectId
    const userId = memberDetails[0].userId

    const projectDetails = await sql`
      SELECT id, code, name FROM "Project" WHERE id = ${projectId}
    `

    const userDetails = await sql`
      SELECT id, name, position, avatar FROM "User" WHERE id = ${userId}
    `

    const result = {
      ...updatedMember[0],
      project: projectDetails[0],
      user: userDetails[0],
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating project member:", error)
    return NextResponse.json({ error: "Failed to update project member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Kiểm tra phân công tồn tại
    const existingMember = await sql`
      SELECT id FROM "ProjectMember" WHERE id = ${id}
    `

    if (existingMember.length === 0) {
      return NextResponse.json({ error: "Project member not found" }, { status: 404 })
    }

    // Xóa phân công
    await sql`
      DELETE FROM "ProjectMember"
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project member:", error)
    return NextResponse.json({ error: "Failed to delete project member" }, { status: 500 })
  }
}
