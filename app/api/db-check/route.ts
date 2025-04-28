import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    console.log("API: Checking database connection...")

    // Thử kết nối đơn giản
    try {
      // Thử kết nối và thực hiện truy vấn đơn giản
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as connected`
      console.log("Database connection successful:", result)

      // Nếu kết nối thành công, lấy danh sách bảng
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `

      return NextResponse.json({
        status: "success",
        message: "Kết nối cơ sở dữ liệu thành công",
        tables,
      })
    } catch (error) {
      console.error("Database connection error:", error)

      // Kiểm tra DATABASE_URL
      const dbUrl = process.env.DATABASE_URL || ""
      const maskedUrl = dbUrl
        ? `${dbUrl.split("://")[0]}://${dbUrl.includes("@") ? "***:***@" + dbUrl.split("@")[1] : "***"}`
        : "Không tìm thấy"

      return NextResponse.json({
        status: "error",
        message: "Lỗi kết nối cơ sở dữ liệu",
        error: String(error),
        details: {
          databaseUrl: maskedUrl,
        },
      })
    }
  } catch (error) {
    console.error("API error:", error)

    return NextResponse.json({
      status: "error",
      message: "Lỗi API",
      error: String(error),
    })
  } finally {
    await prisma.$disconnect()
  }
}
