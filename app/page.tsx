import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kiều Gia Construction</h1>
          <div className="flex space-x-4">
            <Button asChild variant="outline">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Hệ thống quản lý xây dựng chuyên nghiệp
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Giải pháp toàn diện giúp quản lý dự án xây dựng, theo dõi tiến độ, quản lý vật tư và nhân sự hiệu quả.
              </p>
              <div className="mt-8 space-x-4">
                <Button asChild size="lg">
                  <Link href="/dashboard">Vào Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-gray-200 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Hình ảnh minh họa</span>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Tính năng chính</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Quản lý dự án</h3>
                <p className="mt-2 text-gray-500">
                  Theo dõi tiến độ, quản lý tài liệu và phân công công việc cho các dự án xây dựng.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Quản lý vật tư</h3>
                <p className="mt-2 text-gray-500">
                  Kiểm soát tồn kho, theo dõi xuất nhập vật tư và quản lý nhà cung cấp.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Quản lý khách hàng</h3>
                <p className="mt-2 text-gray-500">
                  Lưu trữ thông tin khách hàng, lịch sử giao dịch và theo dõi yêu cầu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2025 Kiều Gia Construction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
