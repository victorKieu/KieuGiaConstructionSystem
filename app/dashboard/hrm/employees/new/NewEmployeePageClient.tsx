"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { createEmployee, getDepartments, getPositions, getStatuses } from "@/lib/actions/employee-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewEmployeePageClient() {
  // Lấy danh sách phòng ban, chức vụ, trạng thái
  const departments = getDepartments()
  const positions = getPositions()
  const statuses = getStatuses()

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm nhân viên mới</h1>
            <p className="text-muted-foreground">Nhập thông tin để thêm nhân viên mới vào hệ thống</p>
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
            <CardDescription>Nhập đầy đủ thông tin nhân viên mới</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              departments={departments}
              positions={positions}
              statuses={statuses}
              onSubmit={createEmployee}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
