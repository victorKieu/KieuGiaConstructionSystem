import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Package, Users, Clock, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của công ty</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số dự án</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-500 mt-1">0 đang thực hiện, 0 đã hoàn thành</p>
              </div>
              <div className="text-gray-400 bg-gray-100 p-2 rounded-md">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Vật tư tồn kho</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-500 mt-1">0 vật tư sắp hết hàng</p>
              </div>
              <div className="text-gray-400 bg-gray-100 p-2 rounded-md">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <Link
              href="/dashboard/inventory"
              className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách hàng</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
                <p className="text-xs text-gray-500 mt-1">Tổng số khách hàng đã đăng ký</p>
              </div>
              <div className="text-gray-400 bg-gray-100 p-2 rounded-md">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <Link
              href="/dashboard/customers"
              className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoạt động gần đây</p>
                <h3 className="text-3xl font-bold mt-1">24</h3>
                <p className="text-xs text-gray-500 mt-1">Hoạt động trong 24 giờ qua</p>
              </div>
              <div className="text-gray-400 bg-gray-100 p-2 rounded-md">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <Link
              href="/dashboard/activities"
              className="text-sm text-blue-600 hover:underline mt-4 inline-flex items-center"
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Tiến độ dự án</h2>
              <p className="text-sm text-gray-600">Theo dõi tiến độ các dự án đang thực hiện</p>
            </div>
            <div className="p-4 text-center text-gray-500">
              <p>Chưa có dự án nào đang thực hiện</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
