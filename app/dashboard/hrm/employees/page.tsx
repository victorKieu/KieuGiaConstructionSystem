import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, FileBarChart, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { getEmployees } from "@/lib/actions/employee-actions"
import { format } from "date-fns"
import { getStatusLabel } from "@/lib/constants/employee-constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Quản lý nhân viên | Kieu Gia Construction",
  description: "Quản lý thông tin nhân viên công ty",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EmployeesPage() {
  console.log("🔄 Đang render trang danh sách nhân viên...")

  // Lấy danh sách nhân viên từ Supabase
  let employees = []
  let error = null

  try {
    employees = await getEmployees()
    console.log("📋 Số lượng nhân viên đã lấy:", employees.length)
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên:", err)
    error = err instanceof Error ? err.message : "Không thể lấy danh sách nhân viên"
  }

  // Phân loại nhân viên theo trạng thái
  const activeEmployees = employees.filter((emp) => emp.status === "active")
  const onLeaveEmployees = employees.filter((emp) => emp.status === "on_leave")
  const terminatedEmployees = employees.filter((emp) => emp.status === "terminated")

  console.log("📊 Phân loại nhân viên:", {
    total: employees.length,
    active: activeEmployees.length,
    onLeave: onLeaveEmployees.length,
    terminated: terminatedEmployees.length,
  })

  // Hàm render bảng nhân viên
  const renderEmployeeTable = (employeeList: any[]) => (
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
          {employeeList.length > 0 ? (
            employeeList.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="py-3 px-4">{employee.code || "N/A"}</td>
                <td className="py-3 px-4 font-medium">{employee.name}</td>
                <td className="py-3 px-4">{employee.position}</td>
                <td className="py-3 px-4">{employee.department}</td>
                <td className="py-3 px-4">
                  {employee.hire_date ? format(new Date(employee.hire_date), "dd/MM/yyyy") : "N/A"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      employee.status === "active"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : employee.status === "on_leave"
                          ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/20"
                    }`}
                  >
                    {getStatusLabel(employee.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/hrm/employees/${employee.id}/edit`}>
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
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-6 text-center text-muted-foreground">
                Không có nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

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
            <Button size="sm" className="h-9" asChild>
              <Link href="/dashboard/hrm/employees/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Tất cả nhân viên ({employees.length})</TabsTrigger>
              <TabsTrigger value="active">Đang làm việc ({activeEmployees.length})</TabsTrigger>
              <TabsTrigger value="onleave">Nghỉ phép ({onLeaveEmployees.length})</TabsTrigger>
              <TabsTrigger value="terminated">Đã nghỉ việc ({terminatedEmployees.length})</TabsTrigger>
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
              <CardContent>{renderEmployeeTable(employees)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên đang làm việc</CardTitle>
                <CardDescription>Danh sách nhân viên đang làm việc tại công ty</CardDescription>
              </CardHeader>
              <CardContent>
                {activeEmployees.length > 0 ? (
                  renderEmployeeTable(activeEmployees)
                ) : (
                  <p className="text-sm text-muted-foreground">Không có nhân viên nào đang làm việc.</p>
                )}
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
                {onLeaveEmployees.length > 0 ? (
                  renderEmployeeTable(onLeaveEmployees)
                ) : (
                  <p className="text-sm text-muted-foreground">Không có nhân viên nào đang nghỉ phép.</p>
                )}
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
                {terminatedEmployees.length > 0 ? (
                  renderEmployeeTable(terminatedEmployees)
                ) : (
                  <p className="text-sm text-muted-foreground">Không có nhân viên nào đã nghỉ việc.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
