import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"

// Schema cho dữ liệu giao dịch kho
const transactionSchema = z.object({
  itemId: z.number(),
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().positive(),
  unitPrice: z.number().optional(),
  date: z.string().or(z.date()),
  projectId: z.number().optional().nullable(),
  supplierId: z.number().optional().nullable(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  createdById: z.number().default(1), // Tạm thời mặc định là user ID 1
})

// GET /api/inventory/transactions - Lấy danh sách giao dịch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const itemId = searchParams.get("itemId")
    const projectId = searchParams.get("projectId")
    const supplierId = searchParams.get("supplierId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Xây dựng điều kiện tìm kiếm
    const where: any = {}

    if (type) {
      where.type = type
    }

    if (itemId) {
      where.itemId = Number.parseInt(itemId)
    }

    if (projectId) {
      where.projectId = Number.parseInt(projectId)
    }

    if (supplierId) {
      where.supplierId = Number.parseInt(supplierId)
    }

    if (startDate || endDate) {
      where.date = {}

      if (startDate) {
        where.date.gte = new Date(startDate)
      }

      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const transactions = await prisma.inventoryTransaction.findMany({
      where,
      include: {
        item: true,
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json({ data: transactions })
  } catch (error) {
    console.error("Error fetching inventory transactions:", error)
    return NextResponse.json({ error: "Failed to fetch inventory transactions" }, { status: 500 })
  }
}

// POST /api/inventory/transactions - Tạo giao dịch mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = transactionSchema.parse(body)

    // Chuyển đổi date từ string sang Date nếu cần
    const date = typeof validatedData.date === "string" ? new Date(validatedData.date) : validatedData.date

    // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // Lấy thông tin vật tư
      const item = await tx.inventoryItem.findUnique({
        where: { id: validatedData.itemId },
      })

      if (!item) {
        throw new Error("Item not found")
      }

      // Tính toán số lượng mới
      let newQuantity = item.quantity
      if (validatedData.type === "IN") {
        newQuantity += validatedData.quantity
      } else {
        // Kiểm tra số lượng tồn kho
        if (item.quantity < validatedData.quantity) {
          throw new Error("Insufficient quantity in stock")
        }
        newQuantity -= validatedData.quantity
      }

      // Cập nhật số lượng vật tư
      await tx.inventoryItem.update({
        where: { id: validatedData.itemId },
        data: { quantity: newQuantity },
      })

      // Tạo giao dịch mới
      const transaction = await tx.inventoryTransaction.create({
        data: {
          itemId: validatedData.itemId,
          type: validatedData.type,
          quantity: validatedData.quantity,
          unitPrice: validatedData.unitPrice || item.price,
          totalPrice: (validatedData.unitPrice || item.price) * validatedData.quantity,
          date,
          projectId: validatedData.projectId,
          supplierId: validatedData.supplierId,
          reference: validatedData.reference,
          notes: validatedData.notes,
          createdById: validatedData.createdById,
        },
        include: {
          item: true,
        },
      })

      return transaction
    })

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory transaction:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create inventory transaction" }, { status: 500 })
  }
}
