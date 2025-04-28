import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma-client"

export async function GET(request: NextRequest) {
  try {
    const positions = await prisma.position.findMany({
      include: {
        users: true,
      },
    })
    return NextResponse.json(positions)
  } catch (error) {
    console.error("Error fetching positions:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const position = await prisma.position.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Error creating position:", error)
    return NextResponse.json({ error: "Failed to create position" }, { status: 500 })
  }
}
