import type { Metadata } from "next"
import NewEmployeePageClient from "./NewEmployeePageClient"
import { createEmployeeAction } from "@/lib/actions/create-employee-action"

export const metadata: Metadata = {
  title: "Thêm nhân viên mới | Kieu Gia Construction",
  description: "Tạo hồ sơ nhân viên mới",
}

export const dynamic = "force-dynamic"

export default async function NewEmployeePage() {
  return <NewEmployeePageClient createEmployeeAction={createEmployeeAction} />
}
