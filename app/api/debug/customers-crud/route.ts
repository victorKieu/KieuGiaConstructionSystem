import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Thêm export const dynamic = 'force-dynamic' để ngăn Next.js cố gắng render tĩnh route này
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Lấy URL params một cách an toàn
    const url = new URL(request.url)
    const action = url.searchParams.get("action") || "list"
    const id = url.searchParams.get("id")

    console.log(`Debug API - Customers CRUD - Action: ${action}, ID: ${id}`)

    const supabase = createServerSupabaseClient()

    // Liệt kê khách hàng
    if (action === "list") {
      const { data, error, count } = await supabase.from("customers").select("*", { count: "exact" }).limit(10)

      if (error) {
        console.error("Error listing customers:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        action: "list",
        count,
        data,
      })
    }

    // Lấy chi tiết khách hàng
    if (action === "get" && id) {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

      if (error) {
        console.error(`Error getting customer ${id}:`, error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        action: "get",
        data,
      })
    }

    // Tạo khách hàng mẫu
    if (action === "create") {
      const timestamp = Date.now().toString().slice(-4)
      const newCustomer = {
        name: `Test Customer ${timestamp}`,
        type: "company",
        status: "active",
        code: `TEST-${timestamp}`,
        contact_person: "Test Contact",
        phone: "0123456789",
        email: `test${timestamp}@example.com`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("customers").insert([newCustomer]).select()

      if (error) {
        console.error("Error creating test customer:", error)
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            data: newCustomer,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        action: "create",
        data,
      })
    }

    // Cập nhật khách hàng
    if (action === "update" && id) {
      const updateData = {
        name: `Updated Customer ${Date.now().toString().slice(-4)}`,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("customers").update(updateData).eq("id", id).select()

      if (error) {
        console.error(`Error updating customer ${id}:`, error)
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            data: updateData,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        action: "update",
        data,
      })
    }

    // Xóa khách hàng
    if (action === "delete" && id) {
      const { error } = await supabase.from("customers").delete().eq("id", id)

      if (error) {
        console.error(`Error deleting customer ${id}:`, error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        action: "delete",
        message: `Deleted customer with ID: ${id}`,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action or missing ID",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Unexpected error in customers-crud API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
