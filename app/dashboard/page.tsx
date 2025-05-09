export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Dự án</h2>
          <p className="text-gray-600">Quản lý các dự án xây dựng</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Khách hàng</h2>
          <p className="text-gray-600">Quản lý thông tin khách hàng</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Nhân sự</h2>
          <p className="text-gray-600">Quản lý nhân sự và nhân viên</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Kho vật tư</h2>
          <p className="text-gray-600">Quản lý kho và vật tư</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Thiết bị</h2>
          <p className="text-gray-600">Quản lý thiết bị và máy móc</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Báo cáo</h2>
          <p className="text-gray-600">Xem báo cáo và thống kê</p>
        </div>
      </div>
    </div>
  )
}
