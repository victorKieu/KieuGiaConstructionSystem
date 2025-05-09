import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Không tìm thấy trang</h2>
      <p className="mb-6 text-gray-600">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Button asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  )
}
