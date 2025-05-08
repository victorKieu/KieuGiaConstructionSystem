import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserX } from "lucide-react"

export default function EmployeeNotFound() {
  return (
    <MainLayout>
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <UserX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Không tìm thấy nhân viên</h1>
        <p className="text-muted-foreground">Nhân viên bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button asChild>
          <Link href="/dashboard/hrm/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách nhân viên
          </Link>
        </Button>
      </div>
    </MainLayout>
  )
}
