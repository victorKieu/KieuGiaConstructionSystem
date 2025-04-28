import { PrismaClient } from "@prisma/client"

// Khai báo biến global để lưu trữ PrismaClient
declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db

// Hàm kiểm tra kết nối database
export async function checkDatabaseConnection() {
  let connected = false
  try {
    console.log("DB: Checking database connection...")
    // @ts-ignore
    await db.$connect()
    // @ts-ignore
    const result = await db.$queryRaw`SELECT 1 as connected`
    console.log("DB: Connection successful:", result)
    connected = true
    return true
  } catch (error) {
    console.error("DB: Connection failed:", error)
    return false
  } finally {
    if (connected) {
      // @ts-ignore
      await db.$disconnect()
    }
  }
}

export default db
