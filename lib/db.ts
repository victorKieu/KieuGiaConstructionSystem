import { createClient } from "@supabase/supabase-js"

// Khởi tạo kết nối Supabase
const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Khởi tạo PrismaClient với dynamic import để tránh lỗi khi không tìm thấy module
let prisma: any

// Tạo một hàm async để khởi tạo PrismaClient
async function initPrisma() {
    try {
        const { PrismaClient } = await import("@prisma/client")
        return new PrismaClient()
    } catch (error) {
        console.error("Không thể khởi tạo PrismaClient:", error)
        return null
    }
}

// Khởi tạo PrismaClient
const prismaClientSingleton = async () => {
    if (!prisma) {
        prisma = await initPrisma()
    }
    return prisma
}

// Export db và prisma
export const db = prisma
export default prisma

// Hàm kiểm tra kết nối
export async function testConnection() {
    try {
        // Kiểm tra kết nối Prisma
        if (prisma) {
            await prisma.$queryRaw`SELECT 1`
            return { success: true, data: { timestamp: new Date().toISOString() } }
        }

        // Thử kiểm tra kết nối Supabase
        const { data, error } = await supabase.from("pg_stat_statements").select("*").limit(1)
        if (error) throw error
        return { success: true, data: { timestamp: new Date().toISOString() } }
    } catch (error) {
        console.error("Lỗi kết nối đến cơ sở dữ liệu:", error)
        return { success: false, error: "Không thể kết nối đến cơ sở dữ liệu" }
    }
}

// Hàm lấy thông tin cơ sở dữ liệu
export async function getDatabaseInfo() {
    try {
        // Lấy danh sách bảng từ Prisma
        if (prisma) {
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
        }

        // Thử lấy thông tin từ Supabase
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

// Hàm thực thi truy vấn SQL trực tiếp
export async function executeQuery(query: string, params?: any[]) {
    try {
        // Thử thực thi truy vấn với Prisma
        if (prisma) {
            const result = await prisma.$queryRawUnsafe(query, ...(params || []))
            return { success: true, data: result }
        }

        // Thử thực thi truy vấn với Supabase
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

// Khởi tạo PrismaClient khi file được import
prismaClientSingleton().then((client) => {
    prisma = client
    if (process.env.NODE_ENV !== "production") {
        // @ts-ignore
        globalThis.prisma = prisma
    }
})
