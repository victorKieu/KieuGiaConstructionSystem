import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Building, Package, Users, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { InventoryList } from "@/components/dashboard/inventory-list"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { getProjects } from "@/lib/actions/project-actions"
import { getMaterials } from "@/lib/actions/inventory-actions"
import { getCustomers } from "@/lib/actions/customer-actions"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard",
  description: "Tổng quan về hoạt động của công ty",
}

// Cập nhật trang Dashboard để xử lý trường hợp không có dữ liệu
export default async function DashboardPage() {
  // Lấy dữ liệu từ cơ sở dữ liệu
  const [projectsResult, materialsResult, customersResult] = await Promise.all([
    getProjects(),
    getMaterials(),
    getCustomers(),
  ])

  const projects = projectsResult.success ? projectsResult.data : []
  const materials = materialsResult.success ? materialsResult.data : []
  const customers = customersResult.success ? customersResult.data : []

  // Tính toán số liệu tổng quan
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "in_progress").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const totalMaterials = materials.length
  const totalCustomers = customers.length
  const lowStockMaterials = materials.filter((m) => (m.total_stock || 0) < (m.min_stock || 0)).length

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động của công ty</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} đang thực hiện, {completedProjects} đã hoàn thành
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/projects">
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vật tư tồn kho</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">{lowStockMaterials} vật tư sắp hết hàng</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/inventory/materials">
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Tổng số khách hàng đã đăng ký</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/customers">
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động gần đây</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Hoạt động trong 24 giờ qua</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/activities">
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
            <CardDescription>Theo dõi tiến độ các dự án đang thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <ProjectProgress projects={projects.filter((p) => p.status === "in_progress")} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vật tư sắp hết hàng</CardTitle>
            <CardDescription>Danh sách vật tư cần nhập thêm</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <InventoryList materials={materials.filter((m) => (m.total_stock || 0) < (m.min_stock || 0))} />
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/inventory/materials">Xem tất cả vật tư</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <RecentActivities />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
