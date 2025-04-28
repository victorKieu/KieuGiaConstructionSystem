"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Camera, CheckCircle, Clock, FileText, ImageIcon } from "lucide-react"

export function LogDashboard() {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const stats = {
    totalLogs: 156,
    totalProjects: 8,
    totalMedia: 423,
    totalDocuments: 87,
    recentLogs: 12,
  }

  const projectProgress = [
    { id: 1, name: "Chung cư ABC", progress: 45, totalLogs: 42, lastUpdate: "2023-05-15" },
    { id: 2, name: "Biệt thự XYZ", progress: 30, totalLogs: 28, lastUpdate: "2023-05-14" },
    { id: 3, name: "Nhà máy DEF", progress: 15, totalLogs: 18, lastUpdate: "2023-05-10" },
    { id: 4, name: "Trung tâm thương mại GHI", progress: 5, totalLogs: 8, lastUpdate: "2023-05-05" },
  ]

  const recentActivities = [
    {
      id: 1,
      projectName: "Chung cư ABC",
      activity: "Cập nhật tiến độ thi công sàn tầng 5",
      user: "Nguyễn Văn A",
      time: "2 giờ trước",
      type: "update",
    },
    {
      id: 2,
      projectName: "Biệt thự XYZ",
      activity: "Thêm 8 hình ảnh thi công phần mái",
      user: "Trần Thị B",
      time: "5 giờ trước",
      type: "media",
    },
    {
      id: 3,
      projectName: "Nhà máy DEF",
      activity: "Tải lên báo cáo kiểm tra chất lượng",
      user: "Lê Văn C",
      time: "1 ngày trước",
      type: "document",
    },
    {
      id: 4,
      projectName: "Chung cư ABC",
      activity: "Cập nhật tiến độ hoàn thiện tầng 3",
      user: "Phạm Thị D",
      time: "2 ngày trước",
      type: "update",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "media":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      case "document":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng nhật ký</p>
                <h3 className="text-2xl font-bold">{stats.totalLogs}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Dự án</p>
                <h3 className="text-2xl font-bold">{stats.totalProjects}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <BarChart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Hình ảnh/Video</p>
                <h3 className="text-2xl font-bold">{stats.totalMedia}</h3>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Camera className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tài liệu</p>
                <h3 className="text-2xl font-bold">{stats.totalDocuments}</h3>
              </div>
              <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cập nhật gần đây</p>
                <h3 className="text-2xl font-bold">{stats.recentLogs}</h3>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
            <CardDescription>Tiến độ cập nhật nhật ký theo dự án</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectProgress.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.progress}%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>{project.totalLogs} nhật ký</div>
                    <div>Cập nhật: {new Date(project.lastUpdate).toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động cập nhật nhật ký gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-gray-100 p-2">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{activity.projectName}</Badge>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="mt-1 font-medium">{activity.activity}</p>
                    <p className="mt-1 text-xs text-gray-500">Người thực hiện: {activity.user}</p>
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
