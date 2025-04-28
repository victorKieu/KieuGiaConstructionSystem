import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface ProjectOverviewProps {
  project: {
    id: number
    code: string
    name: string
    description: string
    client: string
    location: string
    startDate: string
    expectedEndDate: string
    status: string
    progress: number
    budget: number
    manager: string
  }
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const projectStats = {
    completedTasks: 24,
    totalTasks: 56,
    documents: 15,
    teamMembers: 8,
    expenses: 15000000000,
    income: 20000000000,
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ công việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {projectStats.completedTasks}/{projectStats.totalTasks}
                </p>
                <p className="text-xs text-gray-500">Công việc đã hoàn thành</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 p-2 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{
                  width: `${(projectStats.completedTasks / projectStats.totalTasks) * 100}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tài liệu dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{projectStats.documents}</p>
                <p className="text-xs text-gray-500">Tài liệu đã tải lên</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 p-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thành viên dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{projectStats.teamMembers}</p>
                <p className="text-xs text-gray-500">Nhân sự tham gia</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 p-2 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan tài chính</CardTitle>
            <CardDescription>Tình hình thu chi của dự án</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Thu</span>
                </div>
                <span className="font-medium">{formatCurrency(projectStats.income)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 h-4 w-4 rounded-full bg-red-500"></div>
                  <span>Chi</span>
                </div>
                <span className="font-medium">{formatCurrency(projectStats.expenses)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center">
                  <div className="mr-4 h-4 w-4 rounded-full bg-blue-500"></div>
                  <span>Còn lại</span>
                </div>
                <span className="font-medium">{formatCurrency(projectStats.income - projectStats.expenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin dự án</CardTitle>
            <CardDescription>Chi tiết về dự án</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mã dự án</p>
                  <p>{project.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tiến độ</p>
                  <p>{project.progress}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                <p>{project.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Địa điểm</p>
                <p>{project.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                  <p>{new Date(project.startDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày kết thúc dự kiến</p>
                  <p>{new Date(project.expectedEndDate).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quản lý dự án</p>
                <p>{project.manager}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
