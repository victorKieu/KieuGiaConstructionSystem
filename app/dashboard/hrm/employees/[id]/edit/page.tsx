import type { Metadata } from "next"
import EditEmployeeClientPage from "./EditEmployeeClientPage"

export const metadata: Metadata = {
  title: "Chỉnh sửa nhân viên | Kieu Gia Construction",
  description: "Chỉnh sửa thông tin nhân viên",
}

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  return <EditEmployeeClientPage params={params} />
}
