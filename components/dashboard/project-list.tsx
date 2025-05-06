"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Edit, MoreHorizontal, Trash2, Eye, FileText, Users, MapPin, Plus, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()),
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
      case "in-progress":
        return <Badge className="bg-blue-500">Đang thực hiện</Badge>
      case "planning":
        return <Badge className="bg-amber-500">Lên kế hoạch</Badge>
      case "on-hold":
        return <Badge className="bg-orange-500">Tạm dừng</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>
    }
  }

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    } catch (error) {
      return "Không xác định"
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Chưa có dự án nào</h3>
        <p className="text-muted-foreground mt-1">Bắt đầu bằng cách thêm dự án mới.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/projects/new">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">Mã: {project.code}</p>
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

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description || "Không có mô tả"}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="line-clamp-1">{project.location || "Chưa cập nhật"}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {project.startDate
                          ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(
                              project.endDate,
                            ).toLocaleDateString()}`
                          : "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{project.teamCount || 0} thành viên</span>
                    </div>
                  </div>

                  {project.status === "in-progress" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Tiến độ</span>
                        <span className="text-xs font-medium">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t mt-4">
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs text-gray-500">
                    Cập nhật {project.updatedAt ? formatDate(project.updatedAt) : "chưa xác định"}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </CardFooter>
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
