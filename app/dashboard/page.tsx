import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Kieu Gia Construction</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Admin</span>
            <Link href="/login" className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900">
              Đăng xuất
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Dự án</h3>
              <div className="mt-3 text-3xl font-semibold">12</div>
              <div className="mt-1 text-sm text-gray-500">Tổng số dự án</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <Link href="/dashboard/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Xem chi tiết
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Khách hàng</h3>
              <div className="mt-3 text-3xl font-semibold">24</div>
              <div className="mt-1 text-sm text-gray-500">Tổng số khách hàng</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <Link href="/dashboard/customers" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Xem chi tiết
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Nhân viên</h3>
              <div className="mt-3 text-3xl font-semibold">36</div>
              <div className="mt-1 text-sm text-gray-500">Tổng số nhân viên</div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <Link href="/dashboard/hrm/employees" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Dự án gần đây</h3>
            <div className="mt-4 divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-md font-medium">Dự án {i}</h4>
                      <p className="text-sm text-gray-500">Khách hàng {i}</p>
                    </div>
                    <div className="text-sm text-gray-500">{new Date().toLocaleDateString("vi-VN")}</div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Tiến độ: {i * 20}%</div>
                    <Link
                      href={`/dashboard/projects/${i}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
