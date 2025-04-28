import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma-client"

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        department: true,
        position: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ error: "Failed to fetch personnel" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "user",
        phone: data.phone,
        address: data.address,
        avatar: data.avatar,
        departmentId: data.departmentId ? Number.parseInt(data.departmentId) : null,
        positionId: data.positionId ? Number.parseInt(data.positionId) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        department: true,
        position: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating personnel:", error)
    return NextResponse.json({ error: "Failed to create personnel" }, { status: 500 })
  }
}
