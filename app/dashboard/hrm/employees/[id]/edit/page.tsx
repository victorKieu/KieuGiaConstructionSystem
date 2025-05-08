import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { notFound } from "next/navigation"
import EditEmployeeClientPage from "./EditEmployeeClientPage"

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
      <EditEmployeeClientPage employee={employee} />
    </MainLayout>
  )
}
