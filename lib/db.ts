import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"

// Khởi tạo kết nối Supabase
const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!

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
        // Kiểm tra kết nối Prisma
        await prisma.$queryRaw`SELECT 1`
        return { success: true, data: { timestamp: new Date().toISOString() } }
    } catch (prismaError) {
        console.error("Lỗi kết nối đến cơ sở dữ liệu Prisma:", prismaError)

        // Thử kiểm tra kết nối Supabase
        try {
            const { data, error } = await supabase.from("pg_stat_statements").select("*").limit(1)
            if (error) throw error
            return { success: true, data: { timestamp: new Date().toISOString() } }
        } catch (supabaseError) {
            console.error("Lỗi kết nối đến cơ sở dữ liệu Supabase:", supabaseError)
            return { success: false, error: "Không thể kết nối đến cơ sở dữ liệu" }
        }
    }
}

// Hàm lấy thông tin cơ sở dữ liệu
export async function getDatabaseInfo() {
    try {
        // Lấy danh sách bảng từ Prisma
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

        return {
            success: true,
            data: {
                version: "PostgreSQL",
                tables,
            },
        }
    } catch (prismaError) {
        console.error("Lỗi khi lấy thông tin cơ sở dữ liệu từ Prisma:", prismaError)

        // Thử lấy thông tin từ Supabase
        try {
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
        } catch (supabaseError) {
            console.error("Lỗi khi lấy thông tin cơ sở dữ liệu từ Supabase:", supabaseError)
            return { success: false, error: "Không thể lấy thông tin cơ sở dữ liệu" }
        }
    }
}

// Hàm thực thi truy vấn SQL trực tiếp
export async function executeQuery(query: string, params?: any[]) {
    try {
        // Thử thực thi truy vấn với Prisma
        const result = await prisma.$queryRawUnsafe(query, ...(params || []))
        return { success: true, data: result }
    } catch (prismaError) {
        console.error("Lỗi khi thực thi truy vấn với Prisma:", prismaError)

        // Thử thực thi truy vấn với Supabase
        try {
            const { data, error } = await supabase.rpc("execute_sql", {
                query_text: query,
                params: params || [],
            })

            if (error) throw error

            return { success: true, data }
        } catch (supabaseError) {
            console.error("Lỗi khi thực thi truy vấn với Supabase:", supabaseError)
            return { success: false, error: "Không thể thực thi truy vấn SQL" }
        }
    }
}
