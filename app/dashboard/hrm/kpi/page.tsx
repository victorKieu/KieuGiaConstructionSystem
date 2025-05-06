import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Download, FileBarChart, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Quản lý KPI | Kieu Gia Construction",
  description: "Quản lý chỉ số KPI của nhân viên",
}

export const dynamic = "force-dynamic"

export default async function KPIPage() {
  // Dữ liệu mẫu KPI
  const kpiRecords = [
    {
      id: "1",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      department: "Kỹ thuật",
      position: "Kỹ sư xây dựng",
      period: "Q2/2023",
      targetCompletion: 95,
      qualityScore: 90,
      timeManagement: 85,
      teamwork: 95,
      overallScore: 91.25,
      status: "Xuất sắc",
    },
    {
      id: "2",
      employeeId: "NV002",
      employeeName: "Trần Thị B",
      department: "Tài chính",
      position: "Kế toán",
      period: "Q2/2023",
      targetCompletion: 90,
      qualityScore: 95,
      timeManagement: 90,
      teamwork: 85,
      overallScore: 90,
      status: "Xuất sắc",
    },
    {
      id: "3",
      employeeId: "NV003",
      employeeName: "Lê Văn C",
      department: "Thi công",
      position: "Giám sát công trình",
      period: "Q2/2023",
      targetCompletion: 85,
      qualityScore: 80,
      timeManagement: 75,
      teamwork: 80,
      overallScore: 80,
      status: "Tốt",
    },
    {
      id: "4",
      employeeId: "NV004",
      employeeName: "Phạm Thị D",
      department: "Hành chính",
      position: "Nhân viên hành chính",
      period: "Q2/2023",
      targetCompletion: 80,
      qualityScore: 85,
      timeManagement: 90,
      teamwork: 90,
      overallScore: 86.25,
      status: "Tốt",
    },
    {
      id: "5",
      employeeId: "NV005",
      employeeName: "Hoàng Văn E",
      department: "Thiết kế",
      position: "Kiến trúc sư",
      period: "Q2/2023",
      targetCompletion: 100,
      qualityScore: 95,
      timeManagement: 90,
      teamwork: 90,
      overallScore: 93.75,
      status: "Xuất sắc",
    },
  ]

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý KPI</h1>
            <p className="text-muted-foreground">Quản lý và đánh giá hiệu suất làm việc của nhân viên</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href="/dashboard/hrm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về HRM
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <FileBarChart className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button size="sm" className="h-9">
              <BarChart3 className="mr-2 h-4 w-4" />
              Tạo đánh giá mới
            </Button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm KPI trung bình</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.25</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+2.5%</span> so với quý trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nhân viên xuất sắc</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">60%</span> tổng số nhân viên
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nhân viên cần cải thiện</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">-2</span> so với quý trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phòng ban xuất sắc</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Thiết kế</div>
              <p className="text-xs text-muted-foreground">
                Điểm trung bình: <span className="text-green-500 font-medium">93.75</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="current">Đánh giá hiện tại</TabsTrigger>
              <TabsTrigger value="history">Lịch sử đánh giá</TabsTrigger>
              <TabsTrigger value="department">Theo phòng ban</TabsTrigger>
              <TabsTrigger value="templates">Mẫu đánh giá</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm nhân viên..." className="w-[250px] pl-8" />
            </div>
          </div>

          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Đánh giá KPI Quý 2/2023</CardTitle>
                    <CardDescription>Kết quả đánh giá KPI của nhân viên trong quý 2/2023</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất báo cáo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-2 text-left">Mã NV</th>
                        <th className="py-3 px-2 text-left">Họ và tên</th>
                        <th className="py-3 px-2 text-left">Phòng ban</th>
                        <th className="py-3 px-2 text-left">Hoàn thành mục tiêu</th>
                        <th className="py-3 px-2 text-left">Chất lượng</th>
                        <th className="py-3 px-2 text-left">Quản lý thời gian</th>
                        <th className="py-3 px-2 text-left">Làm việc nhóm</th>
                        <th className="py-3 px-2 text-left">Điểm tổng</th>
                        <th className="py-3 px-2 text-left">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpiRecords.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="py-3 px-2">{record.employeeId}</td>
                          <td className="py-3 px-2 font-medium">{record.employeeName}</td>
                          <td className="py-3 px-2">{record.department}</td>
                          <td className="py-3 px-2">{record.targetCompletion}%</td>
                          <td className="py-3 px-2">{record.qualityScore}%</td>
                          <td className="py-3 px-2">{record.timeManagement}%</td>
                          <td className="py-3 px-2">{record.teamwork}%</td>
                          <td className="py-3 px-2 font-medium">{record.overallScore}%</td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                record.status === "Xuất sắc"
                                  ? "bg-green-50 text-green-700 ring-green-600/20"
                                  : record.status === "Tốt"
                                    ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                                    : "bg-amber-50 text-amber-700 ring-amber-600/20"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử đánh giá KPI</CardTitle>
                <CardDescription>Xem lịch sử đánh giá KPI của nhân viên qua các kỳ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng xem lịch sử đánh giá đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="department" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá theo phòng ban</CardTitle>
                <CardDescription>Xem đánh giá KPI theo từng phòng ban</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng đánh giá theo phòng ban đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mẫu đánh giá KPI</CardTitle>
                <CardDescription>Quản lý các mẫu đánh giá KPI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng quản lý mẫu đánh giá đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
