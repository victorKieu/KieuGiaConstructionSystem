import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    console.log("API Debug: Starting diagnostics...")

    // Kiểm tra biến môi trường
    const dbUrl = process.env.DATABASE_URL || ""
    const maskedUrl = dbUrl
      ? `${dbUrl.split("://")[0]}://${dbUrl.includes("@") ? "***:***@" + dbUrl.split("@")[1] : "***"}`
      : "Không tìm thấy"

    console.log("API Debug: Database URL:", maskedUrl)

    // Kiểm tra kết nối database
    let dbStatus = "unknown"
    let dbError = null
    let tables = []

    try {
      console.log("API Debug: Testing database connection...")
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as connected`
      console.log("API Debug: Database connection successful:", result)
      dbStatus = "connected"

      // Lấy danh sách bảng
      tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      console.log("API Debug: Tables:", tables)
    } catch (error) {
      console.error("API Debug: Database connection error:", error)
      dbStatus = "error"
      dbError = String(error)
    }

    // Kiểm tra Prisma schema
    let schemaStatus = "unknown"
    let schemaError = null

    try {
      console.log("API Debug: Testing Prisma schema...")
      // Thử truy vấn một bảng cụ thể
      const projectCount = await prisma.project.count()
      console.log("API Debug: Project count:", projectCount)
      schemaStatus = "valid"
    } catch (error) {
      console.error("API Debug: Prisma schema error:", error)
      schemaStatus = "error"
      schemaError = String(error)
    }

    // Thử tạo client và dự án mẫu
    let createStatus = "unknown"
    let createError = null
    let createdProject = null

    try {
      console.log("API Debug: Testing project creation...")

      // Tạo client mẫu
      const testClient = await prisma.client.create({
        data: {
          name: "Debug Client",
          contactName: "Debug Contact",
          email: "debug@example.com",
          phone: "0987654321",
        },
      })

      // Tạo dự án mẫu với clientId
      const testProject = await prisma.project.create({
        data: {
          name: "Dự án test debug",
          code: `DEBUG${Date.now()}`,
          clientId: testClient.id,
          location: "Debug Location",
          startDate: new Date(),
          expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: "PREPARING",
          budget: 1000000,
          progress: 0,
          description: "Dự án tạo để debug",
        },
        include: {
          client: true,
        },
      })

      console.log("API Debug: Project created:", testProject)
      createStatus = "success"
      createdProject = testProject
    } catch (error) {
      console.error("API Debug: Project creation error:", error)
      createStatus = "error"
      createError = String(error)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        url: maskedUrl,
        status: dbStatus,
        error: dbError,
        tables,
      },
      schema: {
        status: schemaStatus,
        error: schemaError,
      },
      projectCreation: {
        status: createStatus,
        error: createError,
        project: createdProject,
      },
    })
  } catch (error) {
    console.error("API Debug: Unexpected error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Lỗi không xác định",
        error: String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
