import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// GET: Lấy danh sách thành viên dự án
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = Number.parseInt(params.id)

    // Kiểm tra xác thực
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const members = await db.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            position: true,
          },
        },
      },
    })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Thêm thành viên vào dự án
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = Number.parseInt(params.id)

    // Kiểm tra xác thực
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role } = body

    // Validate input
    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Kiểm tra dự án tồn tại
    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Kiểm tra người dùng tồn tại
    const existingUser = await db.user.findUnique({
      where: { id: Number.parseInt(userId) },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Kiểm tra người dùng đã là thành viên dự án chưa
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId,
        userId: Number.parseInt(userId),
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 400 })
    }

    // Thêm thành viên vào dự án
    const newMember = await db.projectMember.create({
      data: {
        projectId,
        userId: Number.parseInt(userId),
        role,
        startDate: new Date(),
      },
    })

    return NextResponse.json({ data: newMember }, { status: 201 })
  } catch (error) {
    console.error("Error adding project member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
