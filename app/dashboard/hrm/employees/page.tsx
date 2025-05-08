import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileBarChart, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Quản lý nhân viên | Kieu Gia Construction",
  description: "Quản lý thông tin nhân viên công ty",
}

export const dynamic = "force-dynamic"

export default async function EmployeesPage() {
  // Dữ liệu mẫu nhân viên
  const employees = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      position: "Kỹ sư xây dựng",
      department: "Kỹ thuật",
      joinDate: "01/01/2022",
      status: "Đang làm việc",
    },
    {
      id: "2",
      name: "Trần Thị B",
      position: "Kế toán",
      department: "Tài chính",
      joinDate: "15/03/2022",
      status: "Đang làm việc",
    },
    {
      id: "3",
      name: "Lê Văn C",
      position: "Giám sát công trình",
      department: "Thi công",
      joinDate: "10/05/2022",
      status: "Đang làm việc",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      position: "Nhân viên hành chính",
      department: "Hành chính",
      joinDate: "20/06/2022",
      status: "Đang làm việc",
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      position: "Kiến trúc sư",
      department: "Thiết kế",
      joinDate: "05/08/2022",
      status: "Đang làm việc",
    },
  ]

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
            <p className="text-muted-foreground">Quản lý thông tin và hồ sơ nhân viên công ty</p>
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
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Tất cả nhân viên</TabsTrigger>
              <TabsTrigger value="active">Đang làm việc</TabsTrigger>
              <TabsTrigger value="onleave">Nghỉ phép</TabsTrigger>
              <TabsTrigger value="terminated">Đã nghỉ việc</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm nhân viên..." className="w-[250px] pl-8" />
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle>Danh sách nhân viên</CardTitle>
                <CardDescription>Quản lý thông tin của tất cả nhân viên trong công ty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-4 text-left">Mã NV</th>
                        <th className="py-3 px-4 text-left">Họ và tên</th>
                        <th className="py-3 px-4 text-left">Chức vụ</th>
                        <th className="py-3 px-4 text-left">Phòng ban</th>
                        <th className="py-3 px-4 text-left">Ngày vào làm</th>
                        <th className="py-3 px-4 text-left">Trạng thái</th>
                        <th className="py-3 px-4 text-left">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                          <td className="py-3 px-4">{employee.id}</td>
                          <td className="py-3 px-4 font-medium">{employee.name}</td>
                          <td className="py-3 px-4">{employee.position}</td>
                          <td className="py-3 px-4">{employee.department}</td>
                          <td className="py-3 px-4">{employee.joinDate}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {employee.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Link href={`/dashboard/hrm/employees/${employee.id}`}>
                                  <span className="sr-only">Xem chi tiết</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">Chỉnh sửa</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên đang làm việc</CardTitle>
                <CardDescription>Danh sách nhân viên đang làm việc tại công ty</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hiện có {employees.length} nhân viên đang làm việc tại công ty.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onleave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên đang nghỉ phép</CardTitle>
                <CardDescription>Danh sách nhân viên đang trong thời gian nghỉ phép</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Hiện không có nhân viên nào đang nghỉ phép.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terminated" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên đã nghỉ việc</CardTitle>
                <CardDescription>Danh sách nhân viên đã nghỉ việc tại công ty</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Hiện không có nhân viên nào đã nghỉ việc.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
