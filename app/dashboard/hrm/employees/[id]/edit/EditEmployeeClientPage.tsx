"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import {
  getEmployeeById,
  getDepartments,
  getPositions,
  getStatuses,
  updateEmployee,
} from "@/lib/actions/employee-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditEmployeeClientPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<any>(null)
  const [departments, setDepartments] = useState<any>([])
  const [positions, setPositions] = useState<any>([])
  const [statuses, setStatuses] = useState<any>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await getEmployeeById(params.id)
        if (!employeeData) {
          notFound()
          return
        }
        setEmployee(employeeData)

        const departmentsData = await getDepartments()
        setDepartments(departmentsData)

        const positionsData = await getPositions()
        setPositions(positionsData)

        const statusesData = await getStatuses()
        setStatuses(statusesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // Hàm cập nhật nhân viên với ID
  const updateEmployeeWithId = async (formData: FormData) => {
    "use server"
    await updateEmployee(params.id, formData)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa nhân viên</h1>
            <p className="text-muted-foreground">Cập nhật thông tin nhân viên {employee.name}</p>
          </div>
          <Button variant="outline" size="sm" className="h-9" asChild>
            <Link href={`/dashboard/hrm/employees/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nhân viên</CardTitle>
            <CardDescription>Cập nhật thông tin nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              employee={employee}
              departments={departments}
              positions={positions}
              statuses={statuses}
              onSubmit={updateEmployeeWithId}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
