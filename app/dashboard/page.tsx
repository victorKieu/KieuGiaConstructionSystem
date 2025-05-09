import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bảng điều khiển</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/projects" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dự án</h2>
          <p className="text-gray-600">Quản lý các dự án xây dựng</p>
        </Link>

        <Link href="/dashboard/customers" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Khách hàng</h2>
          <p className="text-gray-600">Quản lý thông tin khách hàng</p>
        </Link>

        <Link href="/dashboard/inventory" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Kho vật tư</h2>
          <p className="text-gray-600">Quản lý kho vật tư và thiết bị</p>
        </Link>

        <Link href="/dashboard/hrm" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Nhân sự</h2>
          <p className="text-gray-600">Quản lý nhân sự và chấm công</p>
        </Link>

        <Link href="/dashboard/settings" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Cài đặt</h2>
          <p className="text-gray-600">Cấu hình hệ thống</p>
        </Link>
      </div>
    </div>
  )
}
