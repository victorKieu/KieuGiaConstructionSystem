import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Building, Package, Users, Clock, TrendingUp, Briefcase, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { InventoryList } from "@/components/dashboard/inventory-list"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { getProjects } from "@/lib/actions/project-actions"
import { getMaterials } from "@/lib/actions/inventory-actions"
import { getCustomers } from "@/lib/actions/customer-actions"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { ProjectStatusChart } from "@/components/dashboard/project-status-chart"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Tổng quan | Kieu Gia Construction",
  description: "Tổng quan về hoạt động và hiệu suất của công ty",
}

export default async function OverviewPage() {
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
  const lowStockMaterials = materials.filter((m) => (m.totalStock || 0) < (m.minStock || 0)).length

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động và hiệu suất của công ty</p>
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
              <Link href="/dashboard">
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
            <CardTitle>Hiệu suất công ty</CardTitle>
            <CardDescription>Biểu đồ hiệu suất hoạt động theo thời gian</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Suspense fallback={<div>Đang tải...</div>}>
              <PerformanceChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Trạng thái dự án</CardTitle>
            <CardDescription>Phân bố dự án theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Suspense fallback={<div>Đang tải...</div>}>
              <ProjectStatusChart projects={projects} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>Tổng quan doanh thu theo quý</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <DollarSign className="h-10 w-10 text-green-500 mb-2" />
              <div className="text-2xl font-bold">15.2 tỷ</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% so với quý trước
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chi phí</CardTitle>
            <CardDescription>Tổng chi phí hoạt động</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Briefcase className="h-10 w-10 text-orange-500 mb-2" />
              <div className="text-2xl font-bold">8.7 tỷ</div>
              <div className="text-sm text-red-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5.2% so với quý trước
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lợi nhuận</CardTitle>
            <CardDescription>Lợi nhuận ròng</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <DollarSign className="h-10 w-10 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">6.5 tỷ</div>
              <div className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.3% so với quý trước
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Vật tư sắp hết hàng</CardTitle>
            <CardDescription>Danh sách vật tư cần nhập thêm</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Đang tải...</div>}>
              <InventoryList materials={materials.filter((m) => (m.totalStock || 0) < (m.minStock || 0))} />
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
