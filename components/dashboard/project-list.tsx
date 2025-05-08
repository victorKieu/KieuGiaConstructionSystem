"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, FileEdit, Trash2, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProjectProgressBar } from "@/components/dashboard/project-progress-bar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { deleteProject } from "@/lib/actions/project-actions"
import { useRouter } from "next/navigation"

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
  customers?: { name: string }
}

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Project>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.construction_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sắp xếp dự án
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortField === "budget" || sortField === "progress") {
      return sortDirection === "asc"
        ? Number(a[sortField] || 0) - Number(b[sortField] || 0)
        : Number(b[sortField] || 0) - Number(a[sortField] || 0)
    }

    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
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

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return "N/A"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Hàm xử lý xóa dự án
  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteProject(projectToDelete)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Dự án đã được xóa thành công",
        })
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể xóa dự án. Vui lòng thử lại sau.",
        })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa dự án. Vui lòng thử lại sau.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  // Hàm lấy tên trạng thái dự án
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      planning: "Kế hoạch",
      in_progress: "Đang thực hiện",
      on_hold: "Tạm dừng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }
    return statusMap[status] || status
  }

  // Hàm lấy màu trạng thái dự án
  const getStatusColor = (status: string) => {
    const statusColorMap: Record<string, string> = {
      planning: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
      in_progress: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
      on_hold: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20",
      completed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
      cancelled: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    }
    return statusColorMap[status] || "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20"
  }

  // Hàm lấy tên loại công trình
  const getConstructionTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      residential: "Nhà ở",
      commercial: "Thương mại",
      industrial: "Công nghiệp",
      infrastructure: "Hạ tầng",
      townhouse: "Nhà phố",
    }
    return typeMap[type] || type
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
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                        >
                          {getStatusName(project.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getConstructionTypeName(project.construction_type)}</td>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(project.id)}
                          >
                            <span className="sr-only">Xóa</span>
                            <Trash2 className="h-4 w-4" />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa dự án</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa dự án"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
