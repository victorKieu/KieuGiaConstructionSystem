"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export default function DashboardOverview() {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const stats = {
    totalProjects: 12,
    activeProjects: 7,
    completedProjects: 5,
    totalTasks: 245,
    completedTasks: 180,
    teamMembers: 15,
  }

  const recentProjects = [
    {
      id: 1,
      name: "Chung cư ABC",
      status: "Đang thi công",
      deadline: "30/06/2024",
      progress: 60,
    },
    {
      id: 2,
      name: "Biệt thự XYZ",
      status: "Đang thi công",
      deadline: "15/05/2024",
      progress: 80,
    },
    {
      id: 3,
      name: "Nhà máy DEF",
      status: "Hoàn thành",
      deadline: "31/12/2023",
      progress: 100,
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số dự án</CardTitle>
            <CardDescription>Số lượng dự án hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-sm text-gray-500">Dự án đang quản lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dự án đang thực hiện</CardTitle>
            <CardDescription>Số lượng dự án đang triển khai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-sm text-gray-500">Dự án đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dự án đã hoàn thành</CardTitle>
            <CardDescription>Số lượng dự án đã bàn giao</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-sm text-gray-500">Dự án đã kết thúc</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nhân sự</CardTitle>
            <CardDescription>Số lượng nhân viên tham gia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-sm text-gray-500">Nhân viên đang làm việc</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Công việc</CardTitle>
            <CardDescription>Tổng quan về công việc</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Hoàn thành</span>
                </div>
                <span className="font-medium">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Chưa hoàn thành</span>
                </div>
                <span className="font-medium">{stats.totalTasks - stats.completedTasks}</span>
              </div>
              <div className="w-full">
                <div className="text-sm font-medium">Tiến độ</div>
                <progress className="w-full" value={stats.completedTasks} max={stats.totalTasks}></progress>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
            <CardDescription>Các dự án đang thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.status}</span>
                  </div>
                  <div className="text-sm text-gray-500">Hạn: {project.deadline}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
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
