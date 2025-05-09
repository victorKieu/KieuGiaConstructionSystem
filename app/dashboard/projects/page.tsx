import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects, getProjectStatusStats, getProjectTypeStats } from "@/lib/actions/project-actions"
import { ProjectSkeleton } from "@/components/dashboard/project-skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, PieChart } from "@/components/ui/charts"
import { formatCurrency } from "@/lib/utils"
import { CalendarDays, CheckCircle, Clock, Construction, FileText, Plus } from "lucide-react"

export const metadata = {
  title: "Dashboard Dự Án | Kiều Gia Construction",
  description: "Tổng quan về các dự án xây dựng",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

async function ProjectDashboardContent() {
  // Lấy dữ liệu dự án
  const { data: projects = [] } = await getProjects()
  const { data: statusStats = [] } = await getProjectStatusStats()
  const { data: typeStats = [] } = await getProjectTypeStats()

  // Tính toán các chỉ số
  const totalProjects = projects.length
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
  const completedProjects = projects.filter((project) => project.status === "completed").length
  const inProgressProjects = projects.filter((project) => project.status === "in_progress").length
  const averageProgress =
    projects.length > 0 ? projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projects.length : 0

  // Dữ liệu cho biểu đồ trạng thái
  const statusChartData = {
    labels: statusStats.map((item) => item.status),
    datasets: [
      {
        data: statusStats.map((item) => item.count),
        backgroundColor: statusStats.map((item) => item.color),
      },
    ],
  }

  // Dữ liệu cho biểu đồ loại dự án
  const typeChartData = {
    labels: typeStats.map((item) => item.type),
    datasets: [
      {
        data: typeStats.map((item) => item.count),
        backgroundColor: typeStats.map((item) => item.color),
      },
    ],
  }

  // Lấy 5 dự án gần đây nhất
  const recentProjects = [...projects]
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    .slice(0, 5)

  return (
    <>
      <DashboardHeader heading="Tổng quan dự án" text="Phân tích và thống kê về các dự án xây dựng">
        <Link href="/dashboard/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm dự án mới
          </Button>
        </Link>
      </DashboardHeader>

      {/* Các chỉ số tổng quan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Đã hoàn thành: {completedProjects} | Đang thực hiện: {inProgressProjects}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ngân sách</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Trung bình: {formatCurrency(totalProjects > 0 ? totalBudget / totalProjects : 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${averageProgress}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedProjects}/{totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ hoàn thành: {totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ phân tích */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Phân bố trạng thái dự án</CardTitle>
            <CardDescription>Số lượng dự án theo từng trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart data={statusChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân bố loại dự án</CardTitle>
            <CardDescription>Số lượng dự án theo từng loại</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={typeChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Danh sách dự án gần đây */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
            <CardDescription>Danh sách 5 dự án mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Chưa có dự án nào</div>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Construction className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {project.code} - {project.customers?.name || "Không có khách hàng"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {project.status === "completed" ? "Hoàn thành" : "Tiến độ"}
                        </div>
                        <div className="text-sm text-muted-foreground">{project.progress || 0}%</div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(project.created_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {recentProjects.length > 0 && (
                <div className="text-center pt-2">
                  <Link href="/dashboard/projects/list">
                    <Button variant="outline">Xem tất cả dự án</Button>
                  </Link>
                </div>
              )}
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
