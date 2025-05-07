"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
  FileText,
  Users,
  Plus,
  Search,
  Briefcase,
  DollarSign,
  MapPin,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { deleteProject } from "@/lib/actions/project-actions"
import { toast } from "@/components/ui/use-toast"
import { ProgressBar } from "./project-progress-bar"

interface ProjectListProps {
  projects: any[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý xóa dự án
  const handleDeleteProject = async () => {
    if (!projectToDelete) return

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
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  // Hàm hiển thị trạng thái dự án
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500">Đang thực hiện</Badge>
      case "planning":
        return <Badge className="bg-amber-500">Kế hoạch</Badge>
      case "on_hold":
        return <Badge className="bg-orange-500">Tạm dừng</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>
    }
  }

  // Hàm hiển thị loại dự án
  const getProjectTypeBadge = (type: string) => {
    switch (type) {
      case "residential":
        return <Badge className="bg-blue-500">Nhà ở</Badge>
      case "commercial":
        return <Badge className="bg-green-500">Thương mại</Badge>
      case "industrial":
        return <Badge className="bg-yellow-500">Công nghiệp</Badge>
      case "infrastructure":
        return <Badge className="bg-purple-500">Hạ tầng</Badge>
      default:
        return <Badge className="bg-gray-500">Khác</Badge>
    }
  }

  // Hàm định dạng ngày tháng
  const formatDateDisplay = (dateString: string) => {
    try {
      if (!dateString) return "Không xác định"
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return "Không xác định"
    }
  }

  // Hàm định dạng số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0)
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Chưa có dự án nào</h3>
        <p className="text-muted-foreground mt-1">Bắt đầu bằng cách thêm dự án mới.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="mr-2 h-4 w-4" /> Thêm dự án mới
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm dự án..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Không tìm thấy dự án</h3>
          <p className="text-muted-foreground mt-1">Thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: project.priority === "high" ? "#e74c3c" : "#3498db" }}
            >
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        {project.project_type && getProjectTypeBadge(project.project_type)}
                      </div>
                      <p className="text-sm text-muted-foreground">Mã dự án: {project.code}</p>
                      {project.customers && (
                        <p className="text-sm text-muted-foreground">Khách hàng: {project.customers.name}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {getStatusBadge(project.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}/documents`}>
                              <FileText className="mr-2 h-4 w-4" /> Tài liệu
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setProjectToDelete(project.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa dự án
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Ngày bắt đầu</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{formatDateDisplay(project.start_date)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Ngày kết thúc</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{formatDateDisplay(project.end_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <ProgressBar
                          label="Tiến độ"
                          value={project.progress || 0}
                          color="#3498db"
                          description={`${project.progress || 0}%`}
                        />

                        {project.location && (
                          <div className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{project.location}</span>
                          </div>
                        )}

                        {project.project_manager && (
                          <div className="text-sm">
                            <span className="font-medium">Quản lý dự án:</span> {project.project_manager}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center">
                        <Briefcase className="h-5 w-5 text-blue-500 mb-1" />
                        <p className="text-xs text-gray-500">Độ phức tạp</p>
                        <p className="font-semibold">{project.complexity || "Thấp"}</p>
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center">
                        <Users className="h-5 w-5 text-green-500 mb-1" />
                        <p className="text-xs text-gray-500">Mức độ ưu tiên</p>
                        <p className="font-semibold">{project.priority || "Thường"}</p>
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center col-span-2">
                        <DollarSign className="h-5 w-5 text-amber-500 mb-1" />
                        <p className="text-xs text-gray-500">Ngân sách</p>
                        <p className="font-semibold">{formatCurrency(project.budget || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa dự án này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dự án này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
              Xóa dự án
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
