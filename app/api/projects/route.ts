import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  console.log("API Projects: Fetching projects...")

  try {
    // Kết nối database
    await prisma.$connect()
    console.log("API Projects: Database connected")

    // Lấy danh sách dự án
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        client: true, // Include client information
      },
    })

    console.log(`API Projects: Found ${projects.length} projects`)

    // Nếu không có dự án, tạo dự án mẫu
    if (projects.length === 0) {
      try {
        console.log("API Projects: No projects found, creating sample project")

        // Tạo client mẫu trước
        const sampleClient = await prisma.client.create({
          data: {
            name: "Công ty ABC",
            contactName: "Nguyễn Văn A",
            email: "contact@abc.com",
            phone: "0123456789",
            address: "Hà Nội",
          },
        })

        console.log("API Projects: Sample client created:", sampleClient)

        // Tạo dự án mẫu với clientId
        const sampleProject = await prisma.project.create({
          data: {
            name: "Dự án mẫu",
            code: `SAMPLE${Date.now()}`,
            clientId: sampleClient.id,
            location: "Hà Nội",
            startDate: new Date(),
            expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            description: "Đây là dự án mẫu",
            budget: 1000000000,
            status: "PREPARING",
            progress: 0,
          },
          include: {
            client: true,
          },
        })

        console.log("API Projects: Sample project created:", sampleProject)
        projects.push(sampleProject)
      } catch (sampleError) {
        console.error("API Projects: Error creating sample project:", sampleError)
      }
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("API Projects: Error:", error)
    return NextResponse.json(
      {
        error: "Lỗi khi tải dự án",
        details: String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  console.log("API Projects: Creating project...")

  try {
    // Kết nối database
    await prisma.$connect()
    console.log("API Projects: Database connected")

    // Lấy dữ liệu từ request
    const data = await request.json()
    console.log("API Projects: Project data:", data)

    // Kiểm tra xem code đã tồn tại chưa
    const existingProject = await prisma.project.findUnique({
      where: { code: data.code },
    })

    if (existingProject) {
      return NextResponse.json({ error: "Mã dự án đã tồn tại" }, { status: 400 })
    }

    // Tìm hoặc tạo client
    let clientId = null
    if (data.client) {
      const client = await prisma.client.findFirst({
        where: { name: data.client },
      })

      if (client) {
        clientId = client.id
      } else {
        // Tạo client mới
        const newClient = await prisma.client.create({
          data: {
            name: data.client,
            contactName: data.contactName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          },
        })
        clientId = newClient.id
      }
    }

    // Tạo dự án mới
    const project = await prisma.project.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description || "",
        clientId: clientId,
        location: data.location,
        startDate: new Date(data.startDate),
        expectedEndDate: new Date(data.expectedEndDate),
        status: data.status || "PREPARING",
        budget: Number.parseFloat(data.budget) || 0,
        progress: 0,
      },
      include: {
        client: true,
      },
    })

    console.log("API Projects: Project created:", project)
    return NextResponse.json(project)
  } catch (error) {
    console.error("API Projects: Error:", error)
    return NextResponse.json(
      {
        error: "Lỗi khi tạo dự án",
        details: String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
