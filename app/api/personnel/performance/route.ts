import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Lấy danh sách người dùng
    const users = await sql`
      SELECT id, username, name, email, phone, role, department, position, avatar, "isActive"
      FROM "User"
      WHERE "isActive" = true
      ORDER BY name ASC
    `

    // Lấy thông tin công việc
    const tasks = await sql`
      SELECT 
        t.id, 
        t."assignedToId", 
        t.name, 
        t.status, 
        t.priority, 
        t."completionPercentage", 
        t."dueDate"
      FROM "Task" t
      WHERE t."assignedToId" IS NOT NULL
    `

    // Tính toán hiệu suất cho từng người dùng
    const performanceData = users.map((user) => {
      const userTasks = tasks.filter((task) => task.assignedToId === user.id)
      const totalTasks = userTasks.length
      const completedTasks = userTasks.filter((task) => task.status === "COMPLETED").length
      const pendingTasks = userTasks.filter((task) => task.status === "IN_PROGRESS").length
      const lateTasks = userTasks.filter(
        (task) => task.status !== "COMPLETED" && new Date(task.dueDate) < new Date(),
      ).length

      return {
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          position: user.position,
          avatar: user.avatar,
        },
        totalTasks,
        completedTasks,
        pendingTasks,
        lateTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        tasks: userTasks.map((task) => ({
          id: task.id,
          name: task.name,
          status: task.status,
          priority: task.priority,
          completionPercentage: task.completionPercentage,
          dueDate: task.dueDate,
        })),
      }
    })

    return NextResponse.json(performanceData)
  } catch (error) {
    console.error("Error fetching performance data:", error)
    return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
  }
}
