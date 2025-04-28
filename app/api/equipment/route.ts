import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"

// Schema cho dữ liệu thiết bị
const equipmentSchema = z.object({
  name: z.string().min(2, { message: "Tên thiết bị phải có ít nhất 2 ký tự" }),
  code: z.string().min(2, { message: "Mã thiết bị phải có ít nhất 2 ký tự" }),
  category: z.string(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  purchaseDate: z.string().or(z.date()),
  purchasePrice: z.number().or(z.string()),
  currentLocation: z.string().optional(),
  assignedToId: z.number().optional().nullable(),
  status: z.string(),
  lastMaintenanceDate: z.string().or(z.date()).optional().nullable(),
  nextMaintenanceDate: z.string().or(z.date()).optional().nullable(),
  maintenanceCycle: z.number().optional(),
})

// GET /api/equipment - Lấy danh sách thiết bị
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const needMaintenance = searchParams.get("needMaintenance") === "true"

    // Xây dựng điều kiện tìm kiếm
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { serialNumber: { contains: search, mode: "insensitive" } },
      ]
    }

    if (needMaintenance) {
      where.nextMaintenanceDate = {
        lte: new Date(new Date().setDate(new Date().getDate() + 30)), // Cần bảo trì trong 30 ngày tới
      }
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ data: equipment })
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

// POST /api/equipment - Tạo thiết bị mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = equipmentSchema.parse(body)

    // Chuyển đổi các giá trị từ string sang number/date nếu cần
    const purchaseDate =
      typeof validatedData.purchaseDate === "string" ? new Date(validatedData.purchaseDate) : validatedData.purchaseDate

    const purchasePrice =
      typeof validatedData.purchasePrice === "string"
        ? Number.parseFloat(validatedData.purchasePrice.replace(/\D/g, ""))
        : validatedData.purchasePrice

    const lastMaintenanceDate = validatedData.lastMaintenanceDate
      ? typeof validatedData.lastMaintenanceDate === "string"
        ? new Date(validatedData.lastMaintenanceDate)
        : validatedData.lastMaintenanceDate
      : null

    const nextMaintenanceDate = validatedData.nextMaintenanceDate
      ? typeof validatedData.nextMaintenanceDate === "string"
        ? new Date(validatedData.nextMaintenanceDate)
        : validatedData.nextMaintenanceDate
      : null

    // Tạo thiết bị mới
    const equipment = await prisma.equipment.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        category: validatedData.category,
        serialNumber: validatedData.serialNumber,
        manufacturer: validatedData.manufacturer,
        purchaseDate,
        purchasePrice,
        currentLocation: validatedData.currentLocation,
        assignedToId: validatedData.assignedToId,
        status: validatedData.status,
        lastMaintenanceDate,
        nextMaintenanceDate,
        maintenanceCycle: validatedData.maintenanceCycle,
      },
    })

    return NextResponse.json({ data: equipment }, { status: 201 })
  } catch (error) {
    console.error("Error creating equipment:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 })
  }
}
