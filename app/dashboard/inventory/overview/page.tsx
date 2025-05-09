import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, Package, TrendingDown, TrendingUp, Warehouse } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { getMaterials, getWarehouses } from "@/lib/actions/inventory-actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Tổng quan Kho vật tư",
  description: "Tổng quan về tình hình kho vật tư",
}

export default async function InventoryOverviewPage() {
  // Lấy dữ liệu từ server
  let materials = []
  let warehouses = []

  try {
    materials = await getMaterials()
  } catch (error) {
    console.error("Error in getMaterials:", error)
  }

  try {
    warehouses = await getWarehouses()
  } catch (error) {
    console.error("Error in getWarehouses:", error)
  }

  // Tính toán số liệu tổng quan
  const totalMaterials = materials.length
  const totalWarehouses = warehouses.length
  const lowStockMaterials = materials.filter((m) => (m.quantity || 0) < (m.min_quantity || 0)).length
  const totalValue = materials.reduce((sum, m) => sum + (m.quantity || 0) * (m.unit_price || 0), 0)

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tổng quan Kho vật tư</h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange className="w-[300px]" />
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số vật tư</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMaterials}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+5</span> vật tư mới trong tháng
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số kho</CardTitle>
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWarehouses}</div>
                  <p className="text-xs text-muted-foreground">Đang hoạt động tốt</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vật tư sắp hết</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowStockMaterials}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 font-medium">Cần nhập thêm</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+8.1%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Biến động tồn kho theo tháng</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    {/* Thay thế BarChart bằng div để tránh lỗi valueFormatter */}
                    <div className="flex h-full items-end gap-2 pb-6">
                      {[
                        { name: "T1", in: 1200, out: 1000 },
                        { name: "T2", in: 1350, out: 1200 },
                        { name: "T3", in: 1450, out: 1300 },
                        { name: "T4", in: 1600, out: 1450 },
                        { name: "T5", in: 1800, out: 1600 },
                        { name: "T6", in: 2100, out: 1900 },
                        { name: "T7", in: 2350, out: 2100 },
                      ].map((item) => (
                        <div key={item.name} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className="w-full bg-green-500 rounded-t-sm"
                            style={{ height: `${(item.in / 2350) * 100}%` }}
                          />
                          <div
                            className="w-full bg-red-500 rounded-t-sm"
                            style={{ height: `${(item.out / 2350) * 100}%` }}
                          />
                          <div className="mt-2 text-xs font-medium">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Vật tư hàng đầu</CardTitle>
                  <CardDescription>Top 5 vật tư theo giá trị</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Xi măng</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[85%] rounded-full bg-blue-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">850M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Thép</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[70%] rounded-full bg-blue-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">700M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Cát</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[55%] rounded-full bg-blue-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">550M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Gạch</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[45%] rounded-full bg-blue-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">450M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Đá</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[35%] rounded-full bg-blue-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">350M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Phân tích tồn kho theo kho</CardTitle>
                  <CardDescription>Phân bố vật tư theo từng kho</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    {/* Thay thế Chart bằng div để tránh lỗi valueFormatter */}
                    <div className="flex h-full flex-col justify-between">
                      <div className="grid grid-cols-3 gap-4 h-full">
                        {warehouses.slice(0, 3).map((warehouse, index) => (
                          <div
                            key={warehouse.id}
                            className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4"
                          >
                            <div className="text-lg font-bold mb-2">{warehouse.name}</div>
                            <div className="text-3xl font-bold text-blue-500">
                              {Math.floor(Math.random() * 100) + 20}%
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Công suất sử dụng</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Phân tích theo danh mục</CardTitle>
                  <CardDescription>Phân bố vật tư theo danh mục</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Vật liệu xây dựng</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[65%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">65%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Thiết bị điện</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[15%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">15%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Thiết bị nước</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[10%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Hoàn thiện</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[10%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Báo cáo tồn kho</CardTitle>
                  <CardDescription>Tổng hợp tồn kho theo thời gian</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống báo cáo
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Báo cáo nhập xuất</CardTitle>
                  <CardDescription>Thống kê nhập xuất theo thời gian</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống báo cáo
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Báo cáo vật tư sắp hết</CardTitle>
                  <CardDescription>Danh sách vật tư cần nhập thêm</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống báo cáo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
