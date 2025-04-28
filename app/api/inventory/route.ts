import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"

// Schema cho dữ liệu vật tư
const inventoryItemSchema = z.object({
  name: z.string().min(2, { message: "Tên vật tư phải có ít nhất 2 ký tự" }),
  category: z.string(),
  unit: z.string(),
  quantity: z.number().or(z.string()),
  minQuantity: z.number().or(z.string()),
  price: z.number().or(z.string()),
  description: z.string().optional(),
  location: z.string().optional(),
})

// GET /api/inventory - Lấy danh sách vật tư
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const lowStock = searchParams.get("lowStock") === "true"

    // Xây dựng điều kiện tìm kiếm
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (lowStock) {
      where.quantity = {
        lte: prisma.inventoryItem.fields.minQuantity,
      }
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 })
  }
}

// POST /api/inventory - Tạo vật tư mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = inventoryItemSchema.parse(body)

    // Chuyển đổi các giá trị từ string sang number nếu cần
    const quantity =
      typeof validatedData.quantity === "string" ? Number.parseFloat(validatedData.quantity) : validatedData.quantity

    const minQuantity =
      typeof validatedData.minQuantity === "string"
        ? Number.parseFloat(validatedData.minQuantity)
        : validatedData.minQuantity

    const price =
      typeof validatedData.price === "string"
        ? Number.parseFloat(validatedData.price.replace(/\D/g, ""))
        : validatedData.price

    // Tạo vật tư mới
    const item = await prisma.inventoryItem.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        unit: validatedData.unit,
        quantity,
        minQuantity,
        price,
        description: validatedData.description,
        location: validatedData.location,
      },
    })

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
  }
}
