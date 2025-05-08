import type { Metadata } from "next"
import { notFound } from "next/navigation"
import EditEmployeeClientPage from "./EditEmployeeClientPage"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { updateEmployeeAction } from "@/lib/actions/update-employee-action"

export const metadata: Metadata = {
  title: "Chỉnh sửa nhân viên | Kieu Gia Construction",
  description: "Cập nhật thông tin nhân viên",
}

export const dynamic = "force-dynamic"

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

  return <EditEmployeeClientPage params={params} updateEmployeeAction={updateEmployeeAction} />
}
