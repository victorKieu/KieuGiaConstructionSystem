import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { z } from "zod"

// Schema cho construction log
const constructionLogSchema = z.object({
  projectId: z.number().or(z.string()),
  date: z.string().or(z.date()),
  weather: z.string().optional(),
  temperature: z.string().optional(),
  workPerformed: z.string(),
  issues: z.string().optional(),
  createdById: z.number().or(z.string()),
})

// GET: Lấy danh sách nhật ký công trình
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Tạo query
    const where = projectId ? { projectId: Number.parseInt(projectId) } : {}

    // Đếm tổng số bản ghi
    const total = await prisma.constructionLog.count({ where })

    // Lấy dữ liệu có phân trang
    const logs = await prisma.constructionLog.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        media: true,
      },
      orderBy: {
        date: "desc",
      },
      skip: offset,
      take: limit,
    })

    return NextResponse.json({
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching construction logs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Tạo nhật ký công trình mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = constructionLogSchema.parse(body)

    // Chuyển đổi projectId từ string sang number nếu cần
    const projectId =
      typeof validatedData.projectId === "string" ? Number.parseInt(validatedData.projectId) : validatedData.projectId

    // Chuyển đổi createdById từ string sang number nếu cần
    const createdById =
      typeof validatedData.createdById === "string"
        ? Number.parseInt(validatedData.createdById)
        : validatedData.createdById

    // Chuyển đổi date từ string sang Date nếu cần
    const date = typeof validatedData.date === "string" ? new Date(validatedData.date) : validatedData.date

    // Tạo nhật ký mới
    const newLog = await prisma.constructionLog.create({
      data: {
        projectId,
        date,
        weather: validatedData.weather,
        temperature: validatedData.temperature,
        workPerformed: validatedData.workPerformed,
        issues: validatedData.issues,
        createdById,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    })

    return NextResponse.json({ data: newLog }, { status: 201 })
  } catch (error) {
    console.error("Error creating construction log:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
