import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { format } from "date-fns"
import { DeleteEmployeeButton } from "@/components/dashboard/delete-employee-button"
import { deleteEmployeeAction } from "@/lib/actions/delete-employee-action"

export const metadata: Metadata = {
  title: "Chi tiết nhân viên | Kieu Gia Construction",
  description: "Xem thông tin chi tiết nhân viên",
}

export const dynamic = "force-dynamic"

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

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
                Quay lại
              </Link>
            </Button>
            <Button size="sm" className="h-9" asChild>
              <Link href={`/dashboard/hrm/employees/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
            <DeleteEmployeeButton id={params.id} deleteEmployeeAction={deleteEmployeeAction} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin cơ bản của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Họ và tên</dt>
                  <dd className="mt-1 text-sm">{employee.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Chức vụ</dt>
                  <dd className="mt-1 text-sm">{employee.position}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phòng ban</dt>
                  <dd className="mt-1 text-sm">{employee.department}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Ngày vào làm</dt>
                  <dd className="mt-1 text-sm">
                    {employee.join_date ? format(new Date(employee.join_date), "dd/MM/yyyy") : "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Trạng thái</dt>
                  <dd className="mt-1 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        employee.status === "Đang làm việc"
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : employee.status === "Nghỉ phép"
                            ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>Thông tin liên hệ của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Số điện thoại</dt>
                  <dd className="mt-1 text-sm">{employee.phone || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd className="mt-1 text-sm">{employee.email || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Địa chỉ</dt>
                  <dd className="mt-1 text-sm">{employee.address || "Chưa cập nhật"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
