import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Trang không tồn tại</h2>
        <p className="text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">Quay lại Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
