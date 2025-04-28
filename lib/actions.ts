"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import prisma from "./prisma-client"

// Schema cho dữ liệu dự án
const projectSchema = z.object({
  name: z.string().min(3, { message: "Tên dự án phải có ít nhất 3 ký tự" }),
  code: z.string().min(2, { message: "Mã dự án phải có ít nhất 2 ký tự" }),
  customer: z.string().min(2, { message: "Tên khách hàng phải có ít nhất 2 ký tự" }),
  location: z.string().min(2, { message: "Địa điểm phải có ít nhất 2 ký tự" }).default("Chưa cập nhật"),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string().optional(),
  budget: z.string().min(1, { message: "Vui lòng nhập ngân sách" }),
  status: z.string(),
  manager: z.string().min(2, { message: "Tên quản lý phải có ít nhất 2 ký tự" }),
})

export async function createProject(formData: z.infer<typeof projectSchema>) {
  try {
    console.log("Server action received data:", formData)

    // Validate dữ liệu
    const validatedData = projectSchema.parse(formData)
    console.log("Validated data:", validatedData)

    // Kiểm tra xem mã dự án đã tồn tại chưa
    const existingProject = await prisma.project.findUnique({
      where: { code: validatedData.code },
    })

    if (existingProject) {
      return {
        success: false,
        error: `Mã dự án "${validatedData.code}" đã tồn tại. Vui lòng chọn mã dự án khác.`,
      }
    }

    // Chuyển đổi budget từ string (đã format) sang number
    const budgetValue = Number.parseFloat(validatedData.budget.replace(/\D/g, ""))
    console.log("Budget value:", budgetValue)

    // Tạo dự án mới trong cơ sở dữ liệu
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        client: validatedData.customer, // Chú ý: field trong schema là client, không phải customer
        location: validatedData.location,
        startDate: validatedData.startDate,
        expectedEndDate: validatedData.endDate, // Chú ý: field trong schema là expectedEndDate
        description: validatedData.description || "",
        budget: budgetValue,
        status: validatedData.status,
        progress: 0, // Thêm giá trị mặc định cho progress
      },
    })

    console.log("Created project:", project)

    // Revalidate cache và redirect
    revalidatePath("/dashboard/projects")
    return { success: true, project }
  } catch (error) {
    console.error("Error creating project:", error)

    // Xử lý lỗi Prisma cụ thể
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi unique constraint (P2002)
      if (error.code === "P2002") {
        const field = error.meta?.target as string[]
        if (field?.includes("code")) {
          return {
            success: false,
            error: "Mã dự án đã tồn tại. Vui lòng chọn mã dự án khác.",
          }
        }
      }
    }

    return { success: false, error: String(error) }
  }
}

export async function updateProject(id: string, formData: z.infer<typeof projectSchema>) {
  try {
    // Validate dữ liệu
    const validatedData = projectSchema.parse(formData)

    // Kiểm tra xem mã dự án đã tồn tại chưa (nếu đã thay đổi)
    const currentProject = await prisma.project.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (currentProject && currentProject.code !== validatedData.code) {
      const existingProject = await prisma.project.findUnique({
        where: { code: validatedData.code },
      })

      if (existingProject) {
        return {
          success: false,
          error: `Mã dự án "${validatedData.code}" đã tồn tại. Vui lòng chọn mã dự án khác.`,
        }
      }
    }

    // Chuyển đổi budget từ string (đã format) sang number
    const budgetValue = Number.parseFloat(validatedData.budget.replace(/\D/g, ""))

    // Cập nhật dự án trong cơ sở dữ liệu
    const project = await prisma.project.update({
      where: { id: Number.parseInt(id) },
      data: {
        name: validatedData.name,
        code: validatedData.code,
        client: validatedData.customer,
        location: validatedData.location,
        startDate: validatedData.startDate,
        expectedEndDate: validatedData.endDate,
        description: validatedData.description || "",
        budget: budgetValue,
        status: validatedData.status,
      },
    })

    // Revalidate cache và redirect
    revalidatePath("/dashboard/projects")
    return { success: true, project }
  } catch (error) {
    console.error("Error updating project:", error)

    // Xử lý lỗi Prisma cụ thể
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi unique constraint (P2002)
      if (error.code === "P2002") {
        const field = error.meta?.target as string[]
        if (field?.includes("code")) {
          return {
            success: false,
            error: "Mã dự án đã tồn tại. Vui lòng chọn mã dự án khác.",
          }
        }
      }
    }

    return { success: false, error: String(error) }
  }
}

export async function deleteProject(id: string) {
  try {
    // Xóa dự án từ cơ sở dữ liệu
    await prisma.project.delete({
      where: { id: Number.parseInt(id) },
    })

    // Revalidate cache
    revalidatePath("/dashboard/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: String(error) }
  }
}

// Schema cho dữ liệu nhật ký công trình
const constructionLogSchema = z.object({
  projectId: z.number(),
  date: z.date(),
  weather: z.string().optional(),
  temperature: z.string().optional(),
  workPerformed: z.string().min(1, { message: "Vui lòng nhập công việc đã thực hiện" }),
  issues: z.string().optional(),
  createdById: z.number().default(1), // Tạm thời mặc định là user ID 1
})

export async function createConstructionLog(formData: z.infer<typeof constructionLogSchema>) {
  try {
    // Validate dữ liệu
    const validatedData = constructionLogSchema.parse(formData)

    // Tạo nhật ký công trình mới
    const log = await prisma.constructionLog.create({
      data: {
        projectId: validatedData.projectId,
        date: validatedData.date,
        weather: validatedData.weather,
        temperature: validatedData.temperature,
        workPerformed: validatedData.workPerformed,
        issues: validatedData.issues,
        createdById: validatedData.createdById,
      },
    })

    // Revalidate cache
    revalidatePath("/dashboard/construction-logs")
    return { success: true, log }
  } catch (error) {
    console.error("Error creating construction log:", error)
    return { success: false, error: String(error) }
  }
}

export async function updateConstructionLog(id: string, formData: z.infer<typeof constructionLogSchema>) {
  try {
    // Validate dữ liệu
    const validatedData = constructionLogSchema.parse(formData)

    // Cập nhật nhật ký công trình
    const log = await prisma.constructionLog.update({
      where: { id: Number.parseInt(id) },
      data: {
        projectId: validatedData.projectId,
        date: validatedData.date,
        weather: validatedData.weather,
        temperature: validatedData.temperature,
        workPerformed: validatedData.workPerformed,
        issues: validatedData.issues,
      },
    })

    // Revalidate cache
    revalidatePath("/dashboard/construction-logs")
    return { success: true, log }
  } catch (error) {
    console.error("Error updating construction log:", error)
    return { success: false, error: String(error) }
  }
}

export async function deleteConstructionLog(id: string) {
  try {
    // Xóa nhật ký công trình
    await prisma.constructionLog.delete({
      where: { id: Number.parseInt(id) },
    })

    // Revalidate cache
    revalidatePath("/dashboard/construction-logs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting construction log:", error)
    return { success: false, error: String(error) }
  }
}
