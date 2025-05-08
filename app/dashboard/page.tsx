import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectList } from "@/components/dashboard/project-list"
import { getProjects } from "@/lib/actions/project-actions"

export const metadata: Metadata = {
  title: "Danh sách dự án | Kieu Gia Construction",
  description: "Quản lý thông tin dự án xây dựng",
}

// Đảm bảo trang luôn được render động
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectsPage() {
  // Lấy dữ liệu dự án từ server action
  const projectsResult = await getProjects()
  const projects = projectsResult.success ? projectsResult.data : []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Danh sách dự án</h1>
          <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="mr-2 h-4 w-4" />
            Thêm dự án mới
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <ProjectList projects={projects} />
      </div>
    </div>
  )
}
