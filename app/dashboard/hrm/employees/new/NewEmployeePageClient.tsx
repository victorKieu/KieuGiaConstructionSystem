"use client"

import { EmployeeForm } from "@/components/dashboard/employee-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createEmployee } from "@/lib/actions/employee-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewEmployeePageClient() {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null)
      await createEmployee(formData)
    } catch (err) {
      console.error("Error creating employee:", err)
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo nhân viên mới")
    }
  }

  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm nhân viên mới</h1>
          <p className="text-muted-foreground">Nhập thông tin để tạo hồ sơ nhân viên mới</p>
        </div>
        <Button variant="outline" size="sm" className="h-9" asChild>
          <Link href="/dashboard/hrm/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin nhân viên cần thêm mới</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
