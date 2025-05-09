import Link from "next/link"
import Image from "next/image"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo-kieu-gia.png" alt="Kieu Gia Logo" width={50} height={50} className="mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Kieu Gia Construction</h1>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Hệ Thống Quản Lý Xây Dựng Toàn Diện</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Giải pháp quản lý hiệu quả cho doanh nghiệp xây dựng, từ dự án, nhân sự đến vật tư và thiết bị.
            </p>
            <Link
              href="/login"
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-lg font-medium"
            >
              Bắt đầu ngay
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-10 text-center">Tính năng nổi bật</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3">Quản lý dự án</h4>
              <p className="text-gray-600">Theo dõi tiến độ, ngân sách và tài nguyên cho mọi dự án xây dựng.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3">Quản lý nhân sự</h4>
              <p className="text-gray-600">Quản lý nhân viên, phân công công việc và theo dõi hiệu suất.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-3">Quản lý vật tư</h4>
              <p className="text-gray-600">Kiểm soát kho vật tư, theo dõi xuất nhập và tối ưu hóa tồn kho.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Kieu Gia Construction. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2 text-gray-400">Nâng Tầm Cuộc Sống, Giá Trị Tương Lai</p>
        </div>
      </footer>
    </div>
  )
}
