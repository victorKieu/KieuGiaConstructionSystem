import { Suspense } from "react"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { InventoryList } from "@/components/dashboard/inventory-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tổng quan" text="Xem tổng quan về dự án, kho hàng và hoạt động gần đây." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />}>
          <ProjectProgress />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />}>
          <InventoryList />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />}>
          <RecentActivities />
        </Suspense>
      </div>
    </DashboardShell>
  )
}
