import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import NewEmployeePageClient from "./NewEmployeePageClient"

export const metadata: Metadata = {
  title: "Thêm nhân viên mới | Kieu Gia Construction",
  description: "Tạo hồ sơ nhân viên mới",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NewEmployeePage() {
  console.log("🔄 Đang render trang thêm mới nhân viên")

  return (
    <MainLayout>
      <NewEmployeePageClient />
    </MainLayout>
  )
}
