import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { getStatusLabel } from "@/lib/constants/employee-constants"
import { DeleteEmployeeButton } from "@/components/dashboard/delete-employee-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi tiết nhân viên | Kieu Gia Construction",
  description: "Xem thông tin chi tiết nhân viên",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  console.log("🔄 Đang render trang chi tiết nhân viên với ID:", params.id)

  const employee = await getEmployeeById(params.id)

  if (!employee) {
    console.log("❌ Không tìm thấy nhân viên với ID:", params.id)
    notFound()
  }

  console.log("✅ Đã tìm thấy nhân viên:", employee.name)

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết nhân viên</h1>
            <p className="text-muted-foreground">Xem thông tin chi tiết của nhân viên</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href="/dashboard/hrm/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Link>
            </Button>
            <Button size="sm" className="h-9" asChild>
              <Link href={`/dashboard/hrm/employees/${employee.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin chi tiết của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-xl font-bold">{employee.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{employee.position}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{employee.department}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Mã nhân viên</h4>
                    <p>{employee.code || "Chưa có mã"}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Ngày vào làm</h4>
                    <p>{employee.hire_date ? format(new Date(employee.hire_date), "dd/MM/yyyy") : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Trạng thái</h4>
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
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Thông tin liên hệ</h4>
                  {employee.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                  )}
                  {employee.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.address}</span>
                    </div>
                  )}
                </div>

                {employee.notes && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Ghi chú</h4>
                    <p className="text-sm">{employee.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
              <CardDescription>Các thao tác với nhân viên này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/hrm/employees/${employee.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa thông tin
                </Link>
              </Button>
              <DeleteEmployeeButton employeeId={employee.id} employeeName={employee.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
