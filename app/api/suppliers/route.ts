import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"

// Schema cho dữ liệu nhà cung cấp
const supplierSchema = z.object({
  name: z.string().min(2, { message: "Tên nhà cung cấp phải có ít nhất 2 ký tự" }),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  status: z.string().default("ACTIVE"),
})

// GET /api/suppliers - Lấy danh sách nhà cung cấp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Xây dựng điều kiện tìm kiếm
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ data: suppliers })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

// POST /api/suppliers - Tạo nhà cung cấp mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = supplierSchema.parse(body)

    // Tạo nhà cung cấp mới
    const supplier = await prisma.supplier.create({
      data: {
        name: validatedData.name,
        contactName: validatedData.contactName,
        phone: validatedData.phone,
        email: validatedData.email,
        address: validatedData.address,
        taxCode: validatedData.taxCode,
        bankAccount: validatedData.bankAccount,
        bankName: validatedData.bankName,
        status: validatedData.status,
      },
    })

    return NextResponse.json({ data: supplier }, { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}
