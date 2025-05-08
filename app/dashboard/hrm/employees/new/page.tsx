import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import NewEmployeePageClient from "./NewEmployeePageClient"

export const metadata: Metadata = {
  title: "Thêm nhân viên mới | Kieu Gia Construction",
  description: "Tạo hồ sơ nhân viên mới trong hệ thống",
}

export default function NewEmployeePage() {
  return (
    <MainLayout>
      <NewEmployeePageClient />
    </MainLayout>
  )
}
