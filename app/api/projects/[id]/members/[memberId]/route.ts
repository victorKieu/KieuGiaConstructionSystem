import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

// PUT: Cập nhật thành viên dự án
export async function PUT(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const projectId = Number.parseInt(params.id)
    const memberId = Number.parseInt(params.memberId)

    // Kiểm tra xác thực
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, endDate } = body

    // Validate input
    if (!role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Kiểm tra thành viên dự án tồn tại
    const existingMember = await db.projectMember.findUnique({
      where: { id: memberId },
    })

    if (!existingMember || existingMember.projectId !== projectId) {
      return NextResponse.json({ error: "Project member not found" }, { status: 404 })
    }

    // Cập nhật thành viên dự án
    const updatedMember = await db.projectMember.update({
      where: { id: memberId },
      data: {
        role,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ data: updatedMember })
  } catch (error) {
    console.error("Error updating project member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE: Xóa thành viên khỏi dự án
export async function DELETE(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const projectId = Number.parseInt(params.id)
    const memberId = Number.parseInt(params.memberId)

    // Kiểm tra xác thực
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra thành viên dự án tồn tại
    const existingMember = await db.projectMember.findUnique({
      where: { id: memberId },
    })

    if (!existingMember || existingMember.projectId !== projectId) {
      return NextResponse.json({ error: "Project member not found" }, { status: 404 })
    }

    // Xóa thành viên khỏi dự án
    await db.projectMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
