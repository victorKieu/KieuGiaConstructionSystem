import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { z } from "zod"

// Schema cho cập nhật dự án
const updateProjectSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
  client: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string().or(z.date()),
  expectedEndDate: z.string().or(z.date()),
  actualEndDate: z.string().or(z.date()).nullable().optional(),
  description: z.string().optional(),
  budget: z.number().or(z.string()),
  status: z.string(),
  progress: z.number().or(z.string()),
})

// GET: Lấy chi tiết dự án
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        stages: true,
        tasks: true,
        members: true,
        documents: true,
        logs: {
          include: {
            media: true,
          },
        },
        warranties: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT: Cập nhật dự án
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Validate dữ liệu
    const validatedData = updateProjectSchema.parse(body)

    // Chuyển đổi budget từ string sang number nếu cần
    const budgetValue =
      typeof validatedData.budget === "string"
        ? Number.parseFloat(validatedData.budget.replace(/\D/g, ""))
        : validatedData.budget

    // Chuyển đổi progress từ string sang number nếu cần
    const progressValue =
      typeof validatedData.progress === "string" ? Number.parseInt(validatedData.progress) : validatedData.progress

    // Chuyển đổi dates từ string sang Date nếu cần
    const startDate =
      typeof validatedData.startDate === "string" ? new Date(validatedData.startDate) : validatedData.startDate

    const expectedEndDate =
      typeof validatedData.expectedEndDate === "string"
        ? new Date(validatedData.expectedEndDate)
        : validatedData.expectedEndDate

    const actualEndDate = validatedData.actualEndDate
      ? typeof validatedData.actualEndDate === "string"
        ? new Date(validatedData.actualEndDate)
        : validatedData.actualEndDate
      : null

    // Cập nhật dự án
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: validatedData.name,
        code: validatedData.code,
        client: validatedData.client,
        location: validatedData.location,
        startDate,
        expectedEndDate,
        actualEndDate,
        description: validatedData.description || "",
        budget: budgetValue,
        status: validatedData.status,
        progress: progressValue,
      },
    })

    return NextResponse.json({ data: updatedProject })
  } catch (error) {
    console.error("Error updating project:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE: Xóa dự án
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Xóa dự án
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
