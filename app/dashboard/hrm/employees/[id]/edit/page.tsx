import { MainLayout } from "@/components/layout/main-layout"
import { getEmployeeById } from "@/lib/actions/employee-actions"
import { notFound } from "next/navigation"
import EditEmployeeClientPage from "./EditEmployeeClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chỉnh sửa nhân viên | Kieu Gia Construction",
  description: "Cập nhật thông tin nhân viên",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  console.log("🔄 Đang render trang chỉnh sửa nhân viên với ID:", params.id)

  try {
    const employee = await getEmployeeById(params.id)

    if (!employee) {
      console.log("❌ Không tìm thấy nhân viên với ID:", params.id)
      notFound()
    }

    console.log("✅ Đã tìm thấy nhân viên:", employee.name)

    return (
      <MainLayout>
        <EditEmployeeClientPage employee={employee} />
      </MainLayout>
    )
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin nhân viên:", error)
    throw error
  }
}
