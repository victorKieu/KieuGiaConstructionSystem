import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-amber-600">Kieu Gia Construction</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/login"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
              >
                Đăng xuất
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 h-96">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Bảng điều khiển</h1>
              <p className="text-gray-600">Chào mừng đến với hệ thống quản lý xây dựng Kieu Gia.</p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Dự án</h3>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">12</div>
                    <p className="mt-1 text-sm text-gray-500">Tổng số dự án đang hoạt động</p>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Khách hàng</h3>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">24</div>
                    <p className="mt-1 text-sm text-gray-500">Tổng số khách hàng</p>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Nhân viên</h3>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">36</div>
                    <p className="mt-1 text-sm text-gray-500">Tổng số nhân viên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
