import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Kiều Gia Construction</h1>
        <p className="text-gray-600 mb-8">Hệ thống quản lý xây dựng chuyên nghiệp</p>
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard">Bảng điều khiển</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
