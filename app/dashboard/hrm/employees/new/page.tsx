import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { createEmployeeAction } from "@/lib/actions/create-employee-action"

export const metadata: Metadata = {
  title: "Thêm nhân viên mới | Kieu Gia Construction",
  description: "Tạo hồ sơ nhân viên mới trong hệ thống",
}

export default function NewEmployeePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm nhân viên mới</h1>
            <p className="text-muted-foreground">Tạo hồ sơ nhân viên mới trong hệ thống</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href="/dashboard/hrm/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhân viên</CardTitle>
            <CardDescription>Nhập thông tin nhân viên mới</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm action={createEmployeeAction} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
