import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Tạo Supabase client
    const supabase = createServerSupabaseClient()

    // Kiểm tra xem bảng customers có tồn tại không
    const { data: tableExists, error: tableCheckError } = await supabase.rpc("check_table_exists", {
      table_name: "customers",
    })

    if (tableCheckError) {
      // Nếu không có hàm check_table_exists, thử truy vấn trực tiếp
      const { data: customers, error: customersError } = await supabase.from("customers").select("*").limit(1)

      if (customersError && customersError.code === "42P01") {
        // Mã lỗi cho "relation does not exist"
        // Bảng không tồn tại, tạo bảng mới
        return await createCustomersTable(supabase)
      } else if (customersError) {
        return NextResponse.json(
          {
            success: false,
            message: "Lỗi khi kiểm tra bảng customers",
            error: customersError,
          },
          { status: 500 },
        )
      }
    } else if (!tableExists) {
      // Bảng không tồn tại, tạo bảng mới
      return await createCustomersTable(supabase)
    }

    // Kiểm tra cấu trúc bảng
    const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
      table_name: "customers",
    })

    if (columnsError) {
      // Nếu không có hàm get_table_columns, trả về thông báo
      return NextResponse.json({
        success: true,
        message: "Bảng customers đã tồn tại, nhưng không thể kiểm tra cấu trúc chi tiết",
        suggestion: "Kiểm tra cấu trúc bảng trong Supabase Dashboard",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Bảng customers đã tồn tại",
      columns,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function createCustomersTable(supabase) {
  try {
    // Tạo bảng customers
    const { error: createError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          code VARCHAR(50),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          phone VARCHAR(50),
          email VARCHAR(255),
          address TEXT,
          taxCode VARCHAR(50),
          website VARCHAR(255),
          description TEXT,
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (createError) {
      // Nếu không có hàm execute_sql, trả về hướng dẫn
      return NextResponse.json(
        {
          success: false,
          message: "Không thể tạo bảng customers tự động",
          suggestion: "Vui lòng tạo bảng customers thủ công trong Supabase Dashboard",
          sqlScript: `
          CREATE TABLE IF NOT EXISTS customers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            code VARCHAR(50),
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            phone VARCHAR(50),
            email VARCHAR(255),
            address TEXT,
            taxCode VARCHAR(50),
            website VARCHAR(255),
            description TEXT,
            createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Đã tạo bảng customers thành công",
    })
  } catch (error) {
    console.error("Error creating customers table:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tạo bảng customers",
        error: error instanceof Error ? error.message : "Unknown error",
        sqlScript: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          code VARCHAR(50),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          phone VARCHAR(50),
          email VARCHAR(255),
          address TEXT,
          taxCode VARCHAR(50),
          website VARCHAR(255),
          description TEXT,
          createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      },
      { status: 500 },
    )
  }
}
