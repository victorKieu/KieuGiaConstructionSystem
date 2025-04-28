import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        projectMembers: {
          include: {
            project: true,
          },
        },
        tasks: true,
        performanceReviews: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ error: "Failed to fetch personnel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        address: data.address,
        avatar: data.avatar,
        departmentId: data.departmentId ? Number.parseInt(data.departmentId) : null,
        positionId: data.positionId ? Number.parseInt(data.positionId) : null,
        isActive: data.isActive,
      },
      include: {
        department: true,
        position: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating personnel:", error)
    return NextResponse.json({ error: "Failed to update personnel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Xóa các bản ghi liên quan trước
    await prisma.projectMember.deleteMany({
      where: { userId: id },
    })

    await prisma.task.deleteMany({
      where: { assigneeId: id },
    })

    await prisma.performanceReview.deleteMany({
      where: { userId: id },
    })

    // Xóa người dùng
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting personnel:", error)
    return NextResponse.json({ error: "Failed to delete personnel" }, { status: 500 })
  }
}
