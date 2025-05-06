import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CustomerNotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground/50" />
      <h2 className="mt-4 text-2xl font-bold">Không tìm thấy khách hàng</h2>
      <p className="mt-2 text-muted-foreground">Khách hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Button className="mt-6" asChild>
        <Link href="/dashboard/customers">Quay lại danh sách khách hàng</Link>
      </Button>
    </div>
  )
}
