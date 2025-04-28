import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const projectMembers = await sql`
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
      ORDER BY pm."startDate" DESC
    `

    // Chuyển đổi dữ liệu để phù hợp với cấu trúc mong muốn
    const formattedMembers = projectMembers.map((member) => ({
      id: member.id,
      projectId: member.projectId,
      userId: member.userId,
      role: member.role,
      startDate: member.startDate,
      endDate: member.endDate,
      project: {
        id: member.projectId,
        code: member.projectCode,
        name: member.projectName,
      },
      user: {
        id: member.userId,
        name: member.userName,
        position: member.userPosition,
        avatar: member.userAvatar,
      },
    }))

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json({ error: "Failed to fetch project members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, userId, role, startDate, endDate } = body

    // Kiểm tra dự án và người dùng tồn tại
    const project = await sql`SELECT id FROM "Project" WHERE id = ${projectId}`
    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const user = await sql`SELECT id FROM "User" WHERE id = ${userId}`
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Kiểm tra xem người dùng đã được phân công vào dự án này chưa
    const existingMember = await sql`
      SELECT id FROM "ProjectMember" 
      WHERE "projectId" = ${projectId} AND "userId" = ${userId}
    `

    if (existingMember.length > 0) {
      return NextResponse.json({ error: "User is already assigned to this project" }, { status: 400 })
    }

    // Tạo phân công mới
    const newMember = await sql`
      INSERT INTO "ProjectMember" (
        "projectId", 
        "userId", 
        role, 
        "startDate", 
        "endDate"
      )
      VALUES (
        ${projectId}, 
        ${userId}, 
        ${role}, 
        ${new Date(startDate)}, 
        ${endDate ? new Date(endDate) : null}
      )
      RETURNING id, "projectId", "userId", role, "startDate", "endDate"
    `

    // Lấy thông tin chi tiết về dự án và người dùng
    const projectDetails = await sql`
      SELECT id, code, name FROM "Project" WHERE id = ${projectId}
    `

    const userDetails = await sql`
      SELECT id, name, position, avatar FROM "User" WHERE id = ${userId}
    `

    const result = {
      ...newMember[0],
      project: projectDetails[0],
      user: userDetails[0],
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating project member:", error)
    return NextResponse.json({ error: "Failed to create project member" }, { status: 500 })
  }
}
