"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, FileEdit, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProjectProgressBar } from "@/components/dashboard/project-progress-bar"
import { formatCurrency } from "@/lib/utils"

type Project = {
  id: string
  code: string
  name: string
  status: string
  progress: number
  construction_type: string
  start_date: string
  end_date: string
  complexity: string
  priority: string
  budget: number
}

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Project>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.construction_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sắp xếp dự án
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortField === "budget" || sortField === "progress") {
      return sortDirection === "asc"
        ? Number(a[sortField]) - Number(b[sortField])
        : Number(b[sortField]) - Number(a[sortField])
    }

    return sortDirection === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]))
  })

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách dự án</CardTitle>
        <CardDescription>Quản lý thông tin các dự án xây dựng</CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm dự án..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 font-medium">
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("code")}
                    >
                      Mã dự án
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("name")}
                    >
                      Tên dự án
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("status")}
                    >
                      Trạng thái
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("construction_type")}
                    >
                      Loại công trình
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("progress")}
                    >
                      Tiến độ
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <Button
                      variant="ghost"
                      className="flex h-8 items-center gap-1 p-0 font-medium"
                      onClick={() => handleSort("budget")}
                    >
                      Ngân sách
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="py-3 px-4">{project.code}</td>
                      <td className="py-3 px-4 font-medium">{project.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            project.status === "Đang thi công"
                              ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                              : project.status === "Đã hoàn thành"
                                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{project.construction_type}</td>
                      <td className="py-3 px-4">
                        <ProjectProgressBar progress={project.progress} />
                      </td>
                      <td className="py-3 px-4">{formatCurrency(project.budget)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <span className="sr-only">Xem chi tiết</span>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/dashboard/projects/${project.id}/edit`}>
                              <span className="sr-only">Chỉnh sửa</span>
                              <FileEdit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      Không tìm thấy dự án nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
