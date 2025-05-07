import { getDashboardStats } from "@/lib/actions/dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, Package, Users } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const { data, error } = (await getDashboardStats()) || { data: null, error: null }

  // Fallback data nếu không có dữ liệu thực
  const stats = data || {
    projectsCount: 0,
    customersCount: 0,
    inventoryCount: 0,
    lowStockItems: [],
    recentActivities: [],
    activeProjects: [],
    recentActivitiesCount: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hoạt động của công ty</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.projectsCount === 0
                ? "0 đang thực hiện, 0 đã hoàn thành"
                : `${stats.activeProjects?.length || 0} đang thực hiện, ${
                    stats.projectsCount - (stats.activeProjects?.length || 0)
                  } đã hoàn thành`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vật tư tồn kho</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventoryCount}</div>
            <p className="text-xs text-muted-foreground">{stats.lowStockItems?.length || 0} vật tư sắp hết hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customersCount}</div>
            <p className="text-xs text-muted-foreground">Tổng số khách hàng đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động gần đây</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivitiesCount}</div>
            <p className="text-xs text-muted-foreground">Hoạt động trong 24 giờ qua</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
            <p className="text-sm text-muted-foreground">Theo dõi tiến độ các dự án đang thực hiện</p>
          </CardHeader>
          <CardContent>
            {stats.activeProjects && stats.activeProjects.length > 0 ? (
              <div className="space-y-4">
                {stats.activeProjects.map((project) => (
                  <div key={project.id} className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{project.name}</span>
                        <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Chưa có dự án nào đang thực hiện
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Vật tư sắp hết hàng</CardTitle>
              <p className="text-sm text-muted-foreground">Danh sách vật tư cần nhập thêm</p>
            </div>
            {stats.lowStockItems && stats.lowStockItems.length > 0 && (
              <Link href="/dashboard/inventory" className="text-sm text-primary hover:underline">
                Xem tất cả vật tư
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {stats.lowStockItems && stats.lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Còn lại: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-destructive">
                      Tối thiểu: {item.min_quantity} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Không có vật tư nào sắp hết hàng
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-1 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Chưa có hoạt động nào gần đây
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
