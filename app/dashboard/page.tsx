import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Kieu Gia Construction",
  description: "Tổng quan hệ thống quản lý công ty xây dựng Kiều Gia",
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-600">Dự án đang thực hiện</h2>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-600">Dự án hoàn thành</h2>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-600">Tổng doanh thu</h2>
              <p className="text-2xl font-bold text-gray-900">125 tỷ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Dự án gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm font-medium text-left text-gray-700 border-b border-gray-200">
                  <th className="pb-3 pl-2">Tên dự án</th>
                  <th className="pb-3">Tiến độ</th>
                  <th className="pb-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-700">
                  <td className="py-3 pl-2">Chung cư Sunshine</td>
                  <td className="py-3">75%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Đang thực hiện</span>
                  </td>
                </tr>
                <tr className="text-gray-700 border-t border-gray-100">
                  <td className="py-3 pl-2">Biệt thự Palm Garden</td>
                  <td className="py-3">100%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">Hoàn thành</span>
                  </td>
                </tr>
                <tr className="text-gray-700 border-t border-gray-100">
                  <td className="py-3 pl-2">Khu đô thị River Park</td>
                  <td className="py-3">35%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">Đang thực hiện</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Nhân sự hoạt động</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm font-medium text-left text-gray-700 border-b border-gray-200">
                  <th className="pb-3 pl-2">Nhân viên</th>
                  <th className="pb-3">Dự án</th>
                  <th className="pb-3">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-700">
                  <td className="py-3 pl-2">Nguyễn Văn A</td>
                  <td className="py-3">Chung cư Sunshine</td>
                  <td className="py-3">Quản lý dự án</td>
                </tr>
                <tr className="text-gray-700 border-t border-gray-100">
                  <td className="py-3 pl-2">Trần Thị B</td>
                  <td className="py-3">Khu đô thị River Park</td>
                  <td className="py-3">Kỹ sư xây dựng</td>
                </tr>
                <tr className="text-gray-700 border-t border-gray-100">
                  <td className="py-3 pl-2">Lê Văn C</td>
                  <td className="py-3">Biệt thự Palm Garden</td>
                  <td className="py-3">Giám sát công trình</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
