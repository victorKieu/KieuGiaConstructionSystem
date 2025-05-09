import { Suspense } from "react"
import type { Metadata } from "next"
import { getProjects } from "@/lib/actions/project-actions"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProjectSkeleton } from "@/components/dashboard/project-skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Danh sách dự án | Kiều Gia Construction",
  description: "Quản lý danh sách các dự án xây dựng",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

async function ProjectListContent() {
  const { data: projects = [], success, error } = await getProjects()

  return (
    <>
      <DashboardHeader heading="Danh sách dự án" text="Quản lý tất cả các dự án xây dựng">
        <Link href="/dashboard/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm dự án mới
          </Button>
        </Link>
      </DashboardHeader>

      {!success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error || "Không thể tải dữ liệu dự án. Vui lòng thử lại sau."}</span>
        </div>
      )}

      {success && projects.length === 0 && (
        <div
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Chưa có dữ liệu! </strong>
          <span className="block sm:inline">Chưa có dự án nào trong hệ thống. Hãy tạo dự án mới để bắt đầu.</span>
        </div>
      )}

      <ProjectList projects={projects} />
    </>
  )
}

export default function ProjectsListPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectListContent />
      </Suspense>
    </DashboardShell>
  )
}
