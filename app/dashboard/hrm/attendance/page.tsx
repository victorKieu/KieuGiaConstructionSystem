import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Download, Search, UserCheck } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Chấm công nhân viên | Kieu Gia Construction",
  description: "Quản lý chấm công và theo dõi giờ làm của nhân viên",
}

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  // Dữ liệu mẫu chấm công
  const attendanceRecords = [
    {
      id: "1",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      date: "15/05/2023",
      checkIn: "07:45",
      checkOut: "17:30",
      status: "Đúng giờ",
      workHours: 8.5,
      overtime: 1,
    },
    {
      id: "2",
      employeeId: "NV002",
      employeeName: "Trần Thị B",
      date: "15/05/2023",
      checkIn: "08:15",
      checkOut: "17:45",
      status: "Đi muộn",
      workHours: 8.5,
      overtime: 1,
    },
    {
      id: "3",
      employeeId: "NV003",
      employeeName: "Lê Văn C",
      date: "15/05/2023",
      checkIn: "07:30",
      checkOut: "17:00",
      status: "Đúng giờ",
      workHours: 8.5,
      overtime: 0,
    },
    {
      id: "4",
      employeeId: "NV004",
      employeeName: "Phạm Thị D",
      date: "15/05/2023",
      checkIn: "08:00",
      checkOut: "17:15",
      status: "Đúng giờ",
      workHours: 8.25,
      overtime: 0,
    },
    {
      id: "5",
      employeeId: "NV005",
      employeeName: "Hoàng Văn E",
      date: "15/05/2023",
      checkIn: "07:50",
      checkOut: "18:30",
      status: "Đúng giờ",
      workHours: 8.5,
      overtime: 2,
    },
  ]

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chấm công nhân viên</h1>
            <p className="text-muted-foreground">Quản lý chấm công và theo dõi giờ làm của nhân viên</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href="/dashboard/hrm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay về HRM
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Lịch làm việc
            </Button>
            <Button size="sm" className="h-9">
              <UserCheck className="mr-2 h-4 w-4" />
              Chấm công
            </Button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số nhân viên</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">Tổng số nhân viên đang làm việc</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đi làm hôm nay</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">92%</span> nhân viên đi làm
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-amber-500 font-medium">8%</span> nhân viên đi muộn
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nghỉ phép</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-500 font-medium">8%</span> nhân viên nghỉ phép
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">Chấm công hàng ngày</TabsTrigger>
              <TabsTrigger value="monthly">Báo cáo tháng</TabsTrigger>
              <TabsTrigger value="overtime">Làm thêm giờ</TabsTrigger>
              <TabsTrigger value="leave">Nghỉ phép</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm nhân viên..." className="w-[250px] pl-8" />
            </div>
          </div>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chấm công ngày 15/05/2023</CardTitle>
                    <CardDescription>Danh sách chấm công nhân viên trong ngày</CardDescription>
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
                        <th className="py-3 px-4 text-left">Mã NV</th>
                        <th className="py-3 px-4 text-left">Họ và tên</th>
                        <th className="py-3 px-4 text-left">Ngày</th>
                        <th className="py-3 px-4 text-left">Giờ vào</th>
                        <th className="py-3 px-4 text-left">Giờ ra</th>
                        <th className="py-3 px-4 text-left">Trạng thái</th>
                        <th className="py-3 px-4 text-left">Giờ làm</th>
                        <th className="py-3 px-4 text-left">Tăng ca</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="py-3 px-4">{record.employeeId}</td>
                          <td className="py-3 px-4 font-medium">{record.employeeName}</td>
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4">{record.checkIn}</td>
                          <td className="py-3 px-4">{record.checkOut}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                record.status === "Đúng giờ"
                                  ? "bg-green-50 text-green-700 ring-green-600/20"
                                  : "bg-amber-50 text-amber-700 ring-amber-600/20"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{record.workHours} giờ</td>
                          <td className="py-3 px-4">{record.overtime} giờ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo chấm công tháng 05/2023</CardTitle>
                <CardDescription>Tổng hợp chấm công của nhân viên trong tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng báo cáo tháng đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overtime" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo làm thêm giờ</CardTitle>
                <CardDescription>Thống kê giờ làm thêm của nhân viên</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng báo cáo làm thêm giờ đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý nghỉ phép</CardTitle>
                <CardDescription>Theo dõi và quản lý nghỉ phép của nhân viên</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chức năng quản lý nghỉ phép đang được phát triển và sẽ sớm được cập nhật.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
