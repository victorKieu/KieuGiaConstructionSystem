import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectSkeleton } from "@/components/dashboard/project-skeleton"

export default function ProjectsListLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Danh sách dự án" text="Quản lý tất cả các dự án xây dựng" />
      <ProjectSkeleton />
    </DashboardShell>
  )
}
