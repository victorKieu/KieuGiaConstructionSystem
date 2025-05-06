import { isSupabaseReady } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin } from "lucide-react"

export default function ProjectsPage() {
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

  // Dữ liệu mẫu cho các dự án
  const projects = [
    {
      id: 1,
      name: "Chung cư Kiều Gia",
      description: "Dự án chung cư cao cấp 20 tầng với 200 căn hộ",
      status: "in-progress",
      progress: 75,
      location: "Quận 2, TP.HCM",
      startDate: "2023-01-15",
      endDate: "2024-06-30",
      members: 24,
    },
    {
      id: 2,
      name: "Biệt thự Vinhomes",
      description: "Khu biệt thự liền kề với 15 căn biệt thự sang trọng",
      status: "in-progress",
      progress: 45,
      location: "Quận 9, TP.HCM",
      startDate: "2023-03-10",
      endDate: "2024-04-15",
      members: 18,
    },
    {
      id: 3,
      name: "Nhà phố Thủ Đức",
      description: "Dự án nhà phố thương mại với 30 căn nhà phố",
      status: "in-progress",
      progress: 90,
      location: "TP. Thủ Đức, TP.HCM",
      startDate: "2022-11-05",
      endDate: "2023-12-20",
      members: 15,
    },
    {
      id: 4,
      name: "Khu dân cư Bình Tân",
      description: "Khu dân cư với 50 căn nhà phố và 100 căn hộ",
      status: "planning",
      progress: 0,
      location: "Quận Bình Tân, TP.HCM",
      startDate: "2024-01-10",
      endDate: "2025-12-31",
      members: 5,
    },
  ]

  // Hàm hiển thị trạng thái dự án
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">Đang thực hiện</Badge>
      case "planning":
        return <Badge className="bg-amber-500">Lên kế hoạch</Badge>
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dự án</h1>
        <Button>Thêm dự án mới</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                {getStatusBadge(project.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{project.location}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{project.members} thành viên</span>
                </div>
              </div>

              {project.status === "in-progress" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Tiến độ</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
