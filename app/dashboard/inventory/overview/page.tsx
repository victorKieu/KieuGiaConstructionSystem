import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, DonutChart } from "@/components/ui/charts"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileBarChart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  PenToolIcon as Tool,
  Warehouse,
  Building2,
  MapPin,
  CloudCog,
  ArrowLeft,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { getMaterials, getWarehouses } from "@/lib/actions/inventory-actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tổng quan kho vật tư | Kieu Gia Construction",
  description: "Tổng quan về tình trạng kho vật tư, thiết bị",
}

export default async function InventoryDashboardPage() {
  // Lấy dữ liệu vật tư và kho từ cơ sở dữ liệu
  const materialsResponse = await getMaterials()
  const warehousesResponse = await getWarehouses()

  const materials = materialsResponse.success ? materialsResponse.data : []
  const warehouses = warehousesResponse.success ? warehousesResponse.data : []

  // Tính tổng giá trị tồn kho
  const totalInventoryValue = materials.reduce(
    (sum, material) => sum + (material.totalStock || 0) * (material.unitPrice || 0),
    0,
  )

  // Đếm số lượng vật tư cần nhập thêm
  const materialsNeedingRestock = materials.filter(
    (material) => (material.totalStock || 0) <= (material.minStock || 0),
  ).length

  // Hàm định dạng tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Dữ liệu thống kê kho
  const warehouseStats = [
    {
      type: "Tổng kho",
      count: warehouses.filter((w) => w.type === "main").length || 1,
      totalValue: totalInventoryValue * 0.6, // Giả định 60% giá trị ở kho chính
      itemCount: materials.length * 0.8, // Giả định 80% vật tư có ở kho chính
      icon: <Warehouse className="h-10 w-10 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      trend: "+5%",
      trendDirection: "up",
    },
    {
      type: "Kho công trình",
      count: warehouses.filter((w) => w.type === "project").length || 2,
      totalValue: totalInventoryValue * 0.3, // Giả định 30% giá trị ở kho công trình
      itemCount: materials.length * 0.5, // Giả định 50% vật tư có ở kho công trình
      icon: <Building2 className="h-10 w-10 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
      trend: "+12%",
      trendDirection: "up",
    },
    {
      type: "Kho vệ tinh",
      count: warehouses.filter((w) => w.type === "satellite").length || 1,
      totalValue: totalInventoryValue * 0.1, // Giả định 10% giá trị ở kho vệ tinh
      itemCount: materials.length * 0.3, // Giả định 30% vật tư có ở kho vệ tinh
      icon: <MapPin className="h-10 w-10 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200",
      trend: "+3%",
      trendDirection: "up",
    },
    {
      type: "Kho ảo",
      count: 1,
      totalValue: 0, // Kho ảo không có giá trị thực
      itemCount: 0, // Kho ảo không có vật tư thực
      icon: <CloudCog className="h-10 w-10 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      trend: "+15%",
      trendDirection: "up",
    },
  ]

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tổng quan kho vật tư</h1>
            <p className="text-muted-foreground">Phân tích tối ưu sử dụng vật tư, thiết bị và tình trạng kho</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về trang chủ
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <FileBarChart className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống dữ liệu
            </Button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng giá trị tồn kho</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" /> +2.5%
                </span>{" "}
                so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vật tư cần nhập thêm</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materialsNeedingRestock}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 font-medium flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" /> +2
                </span>{" "}
                so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vật tư đang vận chuyển</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 đơn</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" /> +2 đơn
                </span>{" "}
                so với tuần trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thiết bị cần bảo trì</CardTitle>
              <Tool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 thiết bị</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-amber-500 font-medium flex items-center">
                  <AlertTriangle className="mr-1 h-3 w-3" /> 1 thiết bị gấp
                </span>{" "}
                trong tuần này
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Thống kê chi tiết theo loại kho */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {warehouseStats.map((warehouse, index) => (
            <Card key={index} className={`border-2 ${warehouse.color}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{warehouse.type}</CardTitle>
                  {warehouse.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Số lượng kho</p>
                    <p className="text-2xl font-bold">{warehouse.count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="text-xl font-bold">{formatCurrency(warehouse.totalValue)}</p>
                    <div className="flex items-center mt-1">
                      {warehouse.trendDirection === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          warehouse.trendDirection === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {warehouse.trend} so với quý trước
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số lượng vật tư</p>
                    <p className="text-lg font-medium">{Math.round(warehouse.itemCount).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Biểu đồ so sánh giá trị tồn kho theo loại kho */}
        <Card>
          <CardHeader>
            <CardTitle>So sánh giá trị tồn kho theo loại kho</CardTitle>
            <CardDescription>Phân tích giá trị tồn kho của từng loại kho</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="aspect-[3/1]"
              data={warehouseStats.map((warehouse) => ({
                name: warehouse.type,
                "Giá trị tồn kho": warehouse.totalValue / 1000000000,
              }))}
              categories={["Giá trị tồn kho"]}
              index="name"
              colors={["#2563eb"]}
              valueFormatter="number"
              showLegend={false}
              showXAxis
              showYAxis
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="usage">Sử dụng vật tư</TabsTrigger>
            <TabsTrigger value="value">Giá trị tồn kho</TabsTrigger>
            <TabsTrigger value="maintenance">Bảo trì thiết bị</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Phân tích giá trị tồn kho theo thời gian</CardTitle>
                  <CardDescription>Biểu đồ giá trị tồn kho theo tháng trong năm 2023</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart
                    className="aspect-[2/1]"
                    data={[
                      { name: "T1", Tổng_kho: 4000, Kho_công_trình: 2400, Kho_vệ_tinh: 1200 },
                      { name: "T2", Tổng_kho: 3500, Kho_công_trình: 2800, Kho_vệ_tinh: 1300 },
                      { name: "T3", Tổng_kho: 3800, Kho_công_trình: 2900, Kho_vệ_tinh: 1400 },
                      { name: "T4", Tổng_kho: 4200, Kho_công_trình: 3100, Kho_vệ_tinh: 1500 },
                      { name: "T5", Tổng_kho: 4500, Kho_công_trình: 3300, Kho_vệ_tinh: 1600 },
                      { name: "T6", Tổng_kho: 4800, Kho_công_trình: 3500, Kho_vệ_tinh: 1700 },
                      { name: "T7", Tổng_kho: 5000, Kho_công_trình: 3700, Kho_vệ_tinh: 1800 },
                      { name: "T8", Tổng_kho: 5200, Kho_công_trình: 3900, Kho_vệ_tinh: 1900 },
                      { name: "T9", Tổng_kho: 5400, Kho_công_trình: 4100, Kho_vệ_tinh: 2000 },
                      { name: "T10", Tổng_kho: 5600, Kho_công_trình: 4300, Kho_vệ_tinh: 2100 },
                      { name: "T11", Tổng_kho: 5800, Kho_công_trình: 4500, Kho_vệ_tinh: 2200 },
                      { name: "T12", Tổng_kho: 6000, Kho_công_trình: 4700, Kho_vệ_tinh: 2300 },
                    ]}
                    categories={["Tổng_kho", "Kho_công_trình", "Kho_vệ_tinh"]}
                    colors={["#2563eb", "#f59e0b", "#10b981"]}
                    valueFormatter="number"
                    showLegend
                    showXAxis
                    showYAxis
                  />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Phân bổ vật tư theo loại kho</CardTitle>
                  <CardDescription>Tỷ lệ phân bổ vật tư theo từng loại kho</CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    className="aspect-square"
                    data={warehouseStats.map((warehouse) => ({
                      name: warehouse.type,
                      value: warehouse.itemCount,
                    }))}
                    category="value"
                    index="name"
                    colors={["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"]}
                    valueFormatter="number"
                    showLabel
                    showAnimation
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sử dụng vật tư</CardTitle>
                <CardDescription>Phân tích sử dụng vật tư theo dự án</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">Chức năng đang phát triển</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Chức năng phân tích sử dụng vật tư đang được phát triển và sẽ sớm được cập nhật.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="value" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Giá trị tồn kho</CardTitle>
                <CardDescription>Phân tích giá trị tồn kho theo danh mục</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">Chức năng đang phát triển</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Chức năng phân tích giá trị tồn kho đang được phát triển và sẽ sớm được cập nhật.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bảo trì thiết bị</CardTitle>
                <CardDescription>Lịch bảo trì thiết bị sắp tới</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Tool className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">Chức năng đang phát triển</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Chức năng quản lý bảo trì thiết bị đang được phát triển và sẽ sớm được cập nhật.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
