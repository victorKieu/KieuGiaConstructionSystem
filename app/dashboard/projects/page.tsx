import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProjects, getProjectStatusStats, getProjectHealthStats } from "@/lib/actions/project-actions"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProjectListSkeleton } from "@/components/dashboard/project-skeleton"
import { ProjectStatusChart } from "@/components/dashboard/project-status-chart"
import { isSupabaseReady } from "@/lib/supabase/client"

export const metadata = {
  title: "Quản lý dự án",
  description: "Quản lý thông tin dự án xây dựng",
}

export default async function ProjectsPage() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (typeof window === "undefined" && !isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  // Lấy danh sách dự án và thống kê từ cơ sở dữ liệu
  const [projectsResult, statusStatsResult, healthStatsResult] = await Promise.all([
    getProjects(),
    getProjectStatusStats(),
    getProjectHealthStats(),
  ])

  const projects = projectsResult.success ? projectsResult.data : []
  const statusStats = statusStatsResult.success ? statusStatsResult.data : []
  const healthStats = healthStatsResult.success ? healthStatsResult.data : []

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProjectStatusChart data={statusStats} title="Trạng thái dự án" />
        <ProjectStatusChart data={healthStats} title="Tình trạng dự án" />
      </div>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList projects={projects} />
      </Suspense>
    </div>
  )
}
