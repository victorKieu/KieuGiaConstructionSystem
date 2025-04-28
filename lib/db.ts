import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"

// Khởi tạo kết nối Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Khởi tạo PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

// Hàm kiểm tra kết nối
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("pg_stat_statements").select("*").limit(1)

    if (error) throw error

    return { success: true, data: { timestamp: new Date().toISOString() } }
  } catch (error) {
    console.error("Lỗi kết nối đến cơ sở dữ liệu Supabase:", error)
    return { success: false, error: "Không thể kết nối đến cơ sở dữ liệu Supabase" }
  }
}

// Hàm lấy thông tin cơ sở dữ liệu
export async function getDatabaseInfo() {
  try {
    // Lấy danh sách bảng từ Supabase
    const { data: tables, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name")

    if (error) throw error

    return {
      success: true,
      data: {
        version: "Supabase PostgreSQL",
        tables: tables.map((t) => t.table_name),
      },
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cơ sở dữ liệu:", error)
    return { success: false, error: "Không thể lấy thông tin cơ sở dữ liệu" }
  }
}

// Hàm thực thi truy vấn SQL trực tiếp (thay thế cho neon)
export async function executeQuery(query: string, params?: any[]) {
  try {
    const { data, error } = await supabase.rpc("execute_sql", {
      query_text: query,
      params: params || [],
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Lỗi khi thực thi truy vấn:", error)
    return { success: false, error: "Không thể thực thi truy vấn SQL" }
  }
}
