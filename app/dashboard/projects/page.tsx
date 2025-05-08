import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProjects, getProjectStatusStats, getProjectTypeStats } from "@/lib/actions/project-actions"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProjectListSkeleton } from "@/components/dashboard/project-skeleton"
import { ProjectStatusChart } from "@/components/dashboard/project-status-chart"

export const metadata = {
  title: "Quản lý dự án",
  description: "Quản lý thông tin dự án xây dựng",
}

// Đảm bảo trang luôn được render động
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectsPage() {
  // Lấy danh sách dự án từ Supabase
  const projectsResult = await getProjects()
  console.log("Projects result:", projectsResult)

  const projects = projectsResult.success ? projectsResult.data : []

  // Lấy thống kê chỉ khi có dự án
  let statusStats = []
  let typeStats = []

  if (projects.length > 0) {
    const statusStatsResult = await getProjectStatusStats()
    const typeStatsResult = await getProjectTypeStats()

    statusStats = statusStatsResult.success ? statusStatsResult.data : []
    typeStats = typeStatsResult.success ? typeStatsResult.data : []
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý dự án</h1>
          <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng và theo dõi tiến độ</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="mr-2 h-4 w-4" /> Thêm dự án
          </Link>
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ProjectStatusChart data={statusStats} title="Trạng thái dự án" />
          <ProjectStatusChart data={typeStats} title="Loại dự án" />
        </div>
      )}

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList projects={projects} />
      </Suspense>
    </div>
  )
}
