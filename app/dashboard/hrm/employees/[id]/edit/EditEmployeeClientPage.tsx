"use client"

import { EmployeeForm } from "@/components/dashboard/employee-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type Employee, updateEmployee } from "@/lib/actions/employee-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EditEmployeeClientPageProps {
  employee: Employee
}

export default function EditEmployeeClientPage({ employee }: EditEmployeeClientPageProps) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null)
      if (!employee.id) throw new Error("ID nhân viên không hợp lệ")
      await updateEmployee(employee.id, formData)
    } catch (err) {
      console.error("Error updating employee:", err)
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật thông tin nhân viên")
    }
  }

  return (
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

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhân viên</CardTitle>
          <CardDescription>Cập nhật thông tin nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm employee={employee} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
