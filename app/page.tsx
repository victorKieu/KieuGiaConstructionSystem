import { isSupabaseReady } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (typeof window === "undefined" && !isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Kiều Gia Construction</h1>
          <Link href="/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Hệ thống quản lý xây dựng Kiều Gia</h2>
            <p className="mt-4 text-lg text-gray-600">
              Giải pháp quản lý toàn diện cho dự án xây dựng, kho hàng và thiết bị của bạn.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button size="lg" className="mr-4">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Liên hệ
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Quản lý dự án</h3>
              <p className="mt-2 text-gray-600">
                Theo dõi tiến độ dự án, phân công nhiệm vụ và quản lý tài nguyên một cách hiệu quả.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Quản lý kho hàng</h3>
              <p className="mt-2 text-gray-600">Kiểm soát tồn kho, theo dõi vật tư và tối ưu hóa quy trình mua hàng.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Quản lý thiết bị</h3>
              <p className="mt-2 text-gray-600">
                Theo dõi tình trạng thiết bị, lịch bảo trì và tối ưu hóa việc sử dụng thiết bị.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Kiều Gia Construction. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
