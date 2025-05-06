import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, FileText, ShoppingCart, TrendingDown, Users } from "lucide-react"
import { BarChart, LineChart } from "@/components/ui/charts"
import { MainLayout } from "@/components/layout/main-layout"

export const metadata: Metadata = {
  title: "Tổng quan Mua hàng",
  description: "Tổng quan về hoạt động mua hàng và nhà cung cấp",
}

export default function ProcurementDashboardPage() {
  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tổng quan Mua hàng</h2>
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
                  <CardTitle className="text-sm font-medium">Tổng chi phí mua hàng</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.350.000.000 ₫</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+5.2%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Số lượng đơn hàng</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+12%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nhà cung cấp hoạt động</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+2</span> nhà cung cấp mới
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tiết kiệm chi phí</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">125.000.000 ₫</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+8.1%</span> so với mục tiêu
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Chi phí mua hàng theo tháng</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <BarChart
                      data={[
                        { name: "T1", cost: 1200 },
                        { name: "T2", cost: 1350 },
                        { name: "T3", cost: 1450 },
                        { name: "T4", cost: 1600 },
                        { name: "T5", cost: 1800 },
                        { name: "T6", cost: 2100 },
                        { name: "T7", cost: 2350 },
                      ]}
                      categories={["cost"]}
                      index="name"
                      valueFormatter={(value) => `${value} triệu`}
                      colors={["#2563eb"]}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Nhà cung cấp hàng đầu</CardTitle>
                  <CardDescription>Top 5 nhà cung cấp theo giá trị đơn hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="w-[80px] font-medium">Công ty A</div>
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
                      <div className="w-[80px] font-medium">Công ty B</div>
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
                      <div className="w-[80px] font-medium">Công ty C</div>
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
                      <div className="w-[80px] font-medium">Công ty D</div>
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
                      <div className="w-[80px] font-medium">Công ty E</div>
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
                  <CardTitle>Xu hướng giá vật liệu chính</CardTitle>
                  <CardDescription>Biến động giá các vật liệu chính trong 6 tháng qua</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <LineChart
                      data={[
                        { name: "T2", xi_mang: 100, thep: 100, cat: 100 },
                        { name: "T3", xi_mang: 102, thep: 105, cat: 101 },
                        { name: "T4", xi_mang: 105, thep: 110, cat: 103 },
                        { name: "T5", xi_mang: 108, thep: 115, cat: 102 },
                        { name: "T6", xi_mang: 110, thep: 120, cat: 104 },
                        { name: "T7", xi_mang: 112, thep: 125, cat: 105 },
                      ]}
                      categories={["xi_mang", "thep", "cat"]}
                      index="name"
                      colors={["#3b82f6", "#ef4444", "#10b981"]}
                      valueFormatter={(value) => `${value}%`}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tiết kiệm chi phí theo danh mục</CardTitle>
                  <CardDescription>Phân tích tiết kiệm chi phí theo danh mục vật tư</CardDescription>
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
                          <span className="ml-2 text-sm font-medium">65M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Thiết bị điện</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[40%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">40M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Thiết bị nước</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[25%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">25M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[120px] font-medium">Hoàn thiện</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full w-[15%] rounded-full bg-green-500" />
                          </div>
                          <span className="ml-2 text-sm font-medium">15M</span>
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
                  <CardTitle>Báo cáo chi phí mua hàng</CardTitle>
                  <CardDescription>Tổng hợp chi phí mua hàng theo thời gian</CardDescription>
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
                  <CardTitle>Báo cáo nhà cung cấp</CardTitle>
                  <CardDescription>Đánh giá hiệu suất nhà cung cấp</CardDescription>
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
                  <CardTitle>Báo cáo tiết kiệm chi phí</CardTitle>
                  <CardDescription>Phân tích tiết kiệm chi phí theo danh mục</CardDescription>
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
