import type { Metadata } from "next"
import NewEmployeePageClient from "./NewEmployeePageClient"

export const metadata: Metadata = {
  title: "Thêm nhân viên mới | Kieu Gia Construction",
  description: "Thêm nhân viên mới vào hệ thống",
}

export default function NewEmployeePage() {
  return <NewEmployeePageClient />
}
