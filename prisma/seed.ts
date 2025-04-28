import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Tạo người dùng admin
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "Admin",
      email: "admin@kieugia.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  })

  console.log({ admin })

  // Tạo khách hàng mẫu
  const client1 = await prisma.client.upsert({
    where: { id: "client1" },
    update: {},
    create: {
      id: "client1",
      name: "Công ty TNHH ABC",
      contactName: "Nguyễn Văn A",
      email: "contact@abc.com",
      phone: "0901234567",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: "client2" },
    update: {},
    create: {
      id: "client2",
      name: "Công ty CP XYZ",
      contactName: "Trần Thị B",
      email: "contact@xyz.com",
      phone: "0909876543",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    },
  })

  console.log({ client1, client2 })

  // Tạo dự án mẫu
  const project1 = await prisma.project.upsert({
    where: { code: "P001" },
    update: {},
    create: {
      code: "P001",
      name: "Chung cư Sunshine",
      description: "Dự án chung cư cao cấp tại Quận 7, TP.HCM",
      clientId: client1.id,
      location: "Quận 7, TP.HCM",
      startDate: new Date("2023-01-01"),
      expectedEndDate: new Date("2024-12-31"),
      status: "IN_PROGRESS",
      progress: 75,
      budget: 500000000000, // 500 tỷ VND
    },
  })

  const project2 = await prisma.project.upsert({
    where: { code: "P002" },
    update: {},
    create: {
      code: "P002",
      name: "Biệt thự Palm Garden",
      description: "Dự án biệt thự cao cấp tại Quận 9, TP.HCM",
      clientId: client2.id,
      location: "Quận 9, TP.HCM",
      startDate: new Date("2022-06-01"),
      expectedEndDate: new Date("2023-12-31"),
      actualEndDate: new Date("2023-12-15"),
      status: "COMPLETED",
      progress: 100,
      budget: 300000000000, // 300 tỷ VND
    },
  })

  console.log({ project1, project2 })

  // Tạo giai đoạn dự án mẫu
  const stage1 = await prisma.projectStage.upsert({
    where: { id: "stage1" },
    update: {},
    create: {
      id: "stage1",
      projectId: project1.id,
      name: "Thiết kế",
      description: "Giai đoạn thiết kế dự án",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-03-31"),
      status: "COMPLETED",
      completionPercentage: 100,
    },
  })

  const stage2 = await prisma.projectStage.upsert({
    where: { id: "stage2" },
    update: {},
    create: {
      id: "stage2",
      projectId: project1.id,
      name: "Móng",
      description: "Giai đoạn xây dựng móng",
      startDate: new Date("2023-04-01"),
      endDate: new Date("2023-08-31"),
      status: "COMPLETED",
      completionPercentage: 100,
    },
  })

  const stage3 = await prisma.projectStage.upsert({
    where: { id: "stage3" },
    update: {},
    create: {
      id: "stage3",
      projectId: project1.id,
      name: "Thân",
      description: "Giai đoạn xây dựng thân",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-06-30"),
      status: "IN_PROGRESS",
      completionPercentage: 65,
    },
  })

  console.log({ stage1, stage2, stage3 })

  // Tạo công việc mẫu
  const task1 = await prisma.task.upsert({
    where: { id: "task1" },
    update: {},
    create: {
      id: "task1",
      projectId: project1.id,
      stageId: stage3.id,
      name: "Xây dựng tầng 10-15",
      description: "Xây dựng các tầng từ 10 đến 15",
      assignedToId: admin.id,
      startDate: new Date("2023-11-01"),
      dueDate: new Date("2024-01-31"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      completionPercentage: 50,
      createdById: admin.id,
    },
  })

  console.log({ task1 })

  // Tạo nhật ký công trình mẫu
  const log1 = await prisma.constructionLog.upsert({
    where: { id: "log1" },
    update: {},
    create: {
      id: "log1",
      projectId: project1.id,
      date: new Date("2023-11-15"),
      weather: "Nắng",
      temperature: "32°C",
      workPerformed: "Hoàn thành đổ bê tông tầng 12",
      issues: "Không có vấn đề phát sinh",
      createdById: admin.id,
    },
  })

  console.log({ log1 })

  // Tạo media mẫu
  const media1 = await prisma.media.upsert({
    where: { id: "media1" },
    update: {},
    create: {
      id: "media1",
      constructionLogId: log1.id,
      type: "IMAGE",
      url: "/city-construction-skyline.png",
      description: "Hình ảnh đổ bê tông tầng 12",
      uploadedAt: new Date("2023-11-15"),
    },
  })

  console.log({ media1 })

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
