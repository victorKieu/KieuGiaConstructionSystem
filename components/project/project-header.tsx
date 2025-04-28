"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, MoreHorizontal, Share, Trash, User } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ProjectHeaderProps {
  project: {
    id: number
    code?: string
    name: string
    description?: string
    client?: string
    location?: string
    startDate?: string | Date
    expectedEndDate?: string | Date
    status?: string
    progress?: number
    budget?: number
    manager?: string
  }
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang thi công":
        return "bg-blue-100 text-blue-800"
      case "Hoàn thành":
        return "bg-green-100 text-green-800"
      case "Tạm dừng":
        return "bg-red-100 text-red-800"
      case "Chuẩn bị":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.code && <Badge variant="outline">{project.code}</Badge>}
            </div>
            {project.description && <p className="text-gray-500">{project.description}</p>}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.client && (
                <div className="flex items-center text-sm text-gray-500">
                  <User className="mr-1 h-4 w-4" />
                  <span>Khách hàng: {project.client}</span>
                </div>
              )}
              {project.startDate && project.expectedEndDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(project.expectedEndDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {project.manager && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Quản lý: {project.manager}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {project.status && <Badge className={getStatusColor(project.status)}>{project.status}</Badge>}
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Xóa dự án
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Tiến độ</div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress || 0}%` }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">{project.progress || 0}%</span>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Ngân sách</div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(project.budget || 0)}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Địa điểm</div>
            <div className="mt-1 text-lg font-semibold">{project.location || "Chưa cập nhật"}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Thời gian còn lại</div>
            <div className="mt-1 text-lg font-semibold">
              {project.expectedEndDate
                ? Math.ceil(
                    (new Date(project.expectedEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )
                : 0}{" "}
              ngày
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
