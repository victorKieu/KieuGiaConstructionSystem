"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { getDepartments, getPositions, getStatuses } from "@/lib/constants/employee-constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NewEmployeePageClientProps {
  createEmployeeAction: (formData: FormData) => Promise<void>
}

export default function NewEmployeePageClient({ createEmployeeAction }: NewEmployeePageClientProps) {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm nhân viên mới</h1>
            <p className="text-muted-foreground">Tạo hồ sơ nhân viên mới</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href="/dashboard/hrm/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhân viên</CardTitle>
            <CardDescription>Nhập thông tin chi tiết của nhân viên mới</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              departments={getDepartments()}
              positions={getPositions()}
              statuses={getStatuses()}
              onSubmit={createEmployeeAction}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
