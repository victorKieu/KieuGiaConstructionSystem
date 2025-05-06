import { isSupabaseReady } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Package, Truck, Users, TrendingUp, AlertTriangle } from "lucide-react"
import { getProjects } from "@/lib/actions/projects"
import { getCustomers } from "@/lib/actions/customers"
import { getMaterials } from "@/lib/actions/inventory"
import { getEmployees } from "@/lib/actions/employees"

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
  let employees = []

  try {
    ;[projects, customers, materials, employees] = await Promise.all([
      getProjects(),
      getCustomers(),
      getMaterials(),
      getEmployees(),
    ])
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  // Dữ liệu mẫu cho tiến độ dự án
  const projectProgress = [
    {
      name: "Chung cư Kiều Gia",
      progress: 75,
      color: "bg-green-500",
    },
    {
      name: "Biệt thự Vinhomes",
      progress: 45,
      color: "bg-blue-500",
    },
    {
      name: "Nhà phố Thủ Đức",
      progress: 90,
      color: "bg-purple-500",
    },
  ]

  // Dữ liệu mẫu cho hoạt động gần đây
  const recentActivities = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Hoàn thành giai đoạn 1",
      description: "Dự án Chung cư Kiều Gia đã hoàn thành giai đoạn 1 đúng tiến độ",
      time: "2 giờ trước",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      title: "Thiếu vật liệu",
      description: "Kho hàng báo cáo thiếu xi măng cho dự án Nhà phố Thủ Đức",
      time: "5 giờ trước",
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Nhân viên mới",
      description: "Nguyễn Văn A đã tham gia vào đội ngũ kỹ sư",
      time: "1 ngày trước",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tổng quan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dự án</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length || 12}</div>
            <p className="text-xs text-gray-500">4 dự án đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kho hàng</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length || 243}</div>
            <p className="text-xs text-gray-500">18 mặt hàng sắp hết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-gray-500">8 thiết bị đang được sử dụng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length || 32}</div>
            <p className="text-xs text-gray-500">5 nhân viên mới trong tháng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgress.map((project) => (
                <div key={project.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{project.name}</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${project.color} h-2 rounded-full`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông báo gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">{activity.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
