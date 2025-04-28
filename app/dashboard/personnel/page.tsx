import type { Metadata } from "next"
import { PersonnelManagement } from "@/components/personnel/personnel-management"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Kieu Gia Construction",
  description: "Quản lý thông tin nhân viên và phân công công việc",
}

export default async function PersonnelPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân sự</h1>
          <p className="text-muted-foreground">Quản lý thông tin nhân viên và phân công công việc</p>
        </div>
      </div>
      <PersonnelManagement />
    </div>
  )
}
