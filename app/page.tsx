import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Kieu Gia Construction Management</h1>
        <p className="mb-8 text-gray-600">Hệ thống quản lý xây dựng chuyên nghiệp. Vui lòng đăng nhập để tiếp tục.</p>
        <Button asChild className="w-full">
          <Link href="/login">Đăng nhập</Link>
        </Button>
      </div>
    </div>
  )
}
