import { Suspense } from "react"
import type { Metadata } from "next"
import { getProjects, getProjectStatusStats, getProjectTypeStats } from "@/lib/actions/project-actions"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectProgressBar } from "@/components/dashboard/project-progress-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectSkeleton } from "@/components/dashboard/project-skeleton"
import { BarChart, PieChart, LineChart } from "@/components/ui/charts"
import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tổng quan dự án | Kiều Gia Construction",
  description: "Tổng quan về tất cả các dự án xây dựng",
}

async function ProjectDashboardContent() {
  // Lấy dữ liệu dự án
  const { data: projects = [], success } = await getProjects()

  // Lấy thống kê trạng thái dự án
  const { data: statusStats = [] } = await getProjectStatusStats()

  // Lấy thống kê loại dự án
  const { data: typeStats = [] } = await getProjectTypeStats()

  // Tính toán các chỉ số tổng hợp
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "in_progress").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const delayedProjects = projects.filter((p) => {
    if (p.status !== "completed" && p.end_date) {
      return new Date(p.end_date) < new Date()
    }
    return false
  }).length

  // Tính tổng ngân sách
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)

  // Tính tiến độ trung bình
  const avgProgress =
    projects.length > 0 ? projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projects.length : 0

  // Dữ liệu cho biểu đồ tiến độ theo thời gian
  const progressData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Tiến độ trung bình",
        data: [10, 25, 30, 40, 45, 52, 60, 65, 70, 75, 80, 85],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    ],
  }

  // Dữ liệu cho biểu đồ ngân sách theo loại dự án
  const budgetByTypeData = {
    labels: typeStats.map((item) => item.type),
    datasets: [
      {
        label: "Ngân sách (triệu VNĐ)",
        data: typeStats.map((_, index) => Math.floor(Math.random() * 5000) + 1000),
        backgroundColor: typeStats.map((item) => item.color),
      },
    ],
  }

  // Dữ liệu cho biểu đồ trạng thái dự án
  const statusData = {
    labels: statusStats.map((item) => item.status),
    datasets: [
      {
        data: statusStats.map((item) => item.count),
        backgroundColor: statusStats.map((item) => item.color),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  return (
    <>
      <DashboardHeader heading="Tổng quan dự án" text="Phân tích và thống kê về tất cả các dự án xây dựng" />

      {/* Các chỉ số tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} dự án đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ngân sách</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Trung bình {formatCurrency(totalBudget / (totalProjects || 1))} / dự án
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{completedProjects} dự án đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án trễ tiến độ</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {((delayedProjects / totalProjects) * 100).toFixed(1)}% tổng số dự án
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ và thống kê */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Biểu đồ trạng thái dự án */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Trạng thái dự án</CardTitle>
            <CardDescription>Phân bố dự án theo trạng thái hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PieChart data={statusData} />
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ ngân sách theo loại dự án */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ngân sách theo loại dự án</CardTitle>
            <CardDescription>Phân bố ngân sách theo từng loại dự án</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={budgetByTypeData} />
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ tiến độ theo thời gian */}
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Tiến độ dự án theo thời gian</CardTitle>
            <CardDescription>Tiến độ trung bình của các dự án theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart data={progressData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách dự án gần đây */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
            <CardDescription>Danh sách 5 dự án được cập nhật gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.code}</p>
                  </div>
                  <div className="w-32">
                    <ProjectProgressBar progress={project.progress || 0} />
                  </div>
                  <div className="ml-4 text-right">
                    <div
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        project.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : project.status === "on_hold"
                              ? "bg-yellow-100 text-yellow-800"
                              : project.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status === "completed"
                        ? "Hoàn thành"
                        : project.status === "in_progress"
                          ? "Đang thực hiện"
                          : project.status === "on_hold"
                            ? "Tạm dừng"
                            : project.status === "cancelled"
                              ? "Đã hủy"
                              : project.status === "planning"
                                ? "Kế hoạch"
                                : "Không xác định"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function ProjectDashboardPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectDashboardContent />
      </Suspense>
    </DashboardShell>
  )
}
