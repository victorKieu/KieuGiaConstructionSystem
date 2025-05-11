import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold tracking-tight mb-2">Không tìm thấy khách hàng</h1>
      <p className="text-muted-foreground mb-6">Khách hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Button asChild>
        <Link href="/dashboard/customers">Quay lại danh sách khách hàng</Link>
      </Button>
    </div>
  )
}
