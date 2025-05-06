import { isSupabaseReady } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { getProjects } from "@/lib/actions/projects"
import { getMaterials } from "@/lib/actions/inventory"
import { getCustomers } from "@/lib/actions/customers"
import Link from "next/link"

export default async function DashboardPage() {
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

  // Lấy dữ liệu tổng quan
  let projects = []
  let customers = []
  let materials = []
  const recentActivities = 24

  try {
    ;[projects, customers, materials] = await Promise.all([getProjects(), getCustomers(), getMaterials()])
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của công ty</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số dự án</p>
              <h3 className="text-3xl font-bold mt-1">0</h3>
              <p className="text-xs text-gray-500 mt-1">0 đang thực hiện, 0 đã hoàn thành</p>
            </div>
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
          >
            Xem chi tiết
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>

        <Card className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Vật tư tồn kho</p>
              <h3 className="text-3xl font-bold mt-1">0</h3>
              <p className="text-xs text-gray-500 mt-1">0 vật tư sắp hết hàng</p>
            </div>
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/inventory"
            className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
          >
            Xem chi tiết
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>

        <Card className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <h3 className="text-3xl font-bold mt-1">0</h3>
              <p className="text-xs text-gray-500 mt-1">Tổng số khách hàng đã đăng ký</p>
            </div>
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/customers"
            className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
          >
            Xem chi tiết
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>

        <Card className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoạt động gần đây</p>
              <h3 className="text-3xl font-bold mt-1">24</h3>
              <p className="text-xs text-gray-500 mt-1">Hoạt động trong 24 giờ qua</p>
            </div>
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/dashboard/activities"
            className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
          >
            Xem chi tiết
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 border rounded-md shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Tiến độ dự án</h2>
            <p className="text-sm text-gray-600">Theo dõi tiến độ các dự án đang thực hiện</p>
          </div>
          <div className="p-4 text-center text-gray-500">
            <p>Chưa có dự án nào đang thực hiện</p>
          </div>
        </Card>

        <Card className="p-4 border rounded-md shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Vật tư sắp hết hàng</h2>
            <p className="text-sm text-gray-600">Danh sách vật tư cần nhập thêm</p>
          </div>
          <div className="p-4 text-center text-gray-500">
            <p>Không có vật tư nào sắp hết hàng</p>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold">Danh Sách Nhà Cung Cấp</h3>
            <p className="text-sm text-gray-600">Quản lý thông tin nhà cung cấp</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
