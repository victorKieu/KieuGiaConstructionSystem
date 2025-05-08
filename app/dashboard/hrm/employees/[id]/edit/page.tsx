import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { updateEmployeeAction } from "@/lib/actions/update-employee-action"

export const metadata: Metadata = {
  title: "Chỉnh sửa nhân viên | Kieu Gia Construction",
  description: "Cập nhật thông tin nhân viên",
}

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa thông tin nhân viên</h1>
            <p className="text-muted-foreground">Cập nhật thông tin nhân viên {employee.name}</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href={`/dashboard/hrm/employees/${employee.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại chi tiết
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhân viên</CardTitle>
            <CardDescription>Cập nhật thông tin nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm employee={employee} action={updateEmployeeAction} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
