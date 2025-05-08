import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { format } from "date-fns"
import { DeleteEmployeeButton } from "@/components/dashboard/delete-employee-button"

export const metadata: Metadata = {
  title: "Chi tiết nhân viên | Kieu Gia Construction",
  description: "Xem thông tin chi tiết nhân viên",
}

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
            <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
            <p className="text-muted-foreground">
              {employee.position} - {employee.department}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href="/dashboard/hrm/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href={`/dashboard/hrm/employees/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
            <DeleteEmployeeButton id={params.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin chi tiết của nhân viên</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Mã nhân viên</dt>
                  <dd>{employee.id}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Họ và tên</dt>
                  <dd>{employee.name}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Chức vụ</dt>
                  <dd>{employee.position}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Phòng ban</dt>
                  <dd>{employee.department}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Ngày vào làm</dt>
                  <dd>{employee.join_date ? format(new Date(employee.join_date), "dd/MM/yyyy") : "N/A"}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Trạng thái</dt>
                  <dd>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
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
              <dl className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Số điện thoại</dt>
                  <dd>{employee.phone || "Chưa cập nhật"}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd>{employee.email || "Chưa cập nhật"}</dd>
                </div>
                <div className="flex flex-col space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Địa chỉ</dt>
                  <dd>{employee.address || "Chưa cập nhật"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
