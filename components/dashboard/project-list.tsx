import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProjectSkeleton } from "./project-skeleton"
import { ProjectProgressBar } from "./project-progress-bar"

// Định nghĩa kiểu dữ liệu cho dự án
interface Project {
  id: string
  code: string
  name: string
  status: string
  start_date: string
  end_date: string
  progress: number
  customers: {
    name: string
  }
}

interface ProjectListProps {
  projects: Project[]
}

// Hàm hiển thị trạng thái dự án
function getStatusBadge(status: string) {
  switch (status) {
    case "planning":
      return <Badge variant="outline">Lập kế hoạch</Badge>
    case "in_progress":
      return <Badge variant="secondary">Đang thực hiện</Badge>
    case "completed":
      return <Badge variant="success">Hoàn thành</Badge>
    case "on_hold":
      return <Badge variant="warning">Tạm dừng</Badge>
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function ProjectList({ projects }: ProjectListProps) {
  // Kiểm tra nếu không có dữ liệu
  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách dự án</CardTitle>
          <CardDescription>Không có dự án nào. Hãy tạo dự án mới để bắt đầu.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách dự án</CardTitle>
        <CardDescription>Quản lý tất cả các dự án xây dựng của công ty</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã dự án</TableHead>
              <TableHead>Tên dự án</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.code}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.customers?.name || "N/A"}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>
                  <ProjectProgressBar progress={project.progress} />
                </TableCell>
                <TableCell>
                  {project.start_date
                    ? format(new Date(project.start_date), "dd/MM/yyyy", {
                        locale: vi,
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {project.end_date
                    ? format(new Date(project.end_date), "dd/MM/yyyy", {
                        locale: vi,
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Xóa</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Skeleton component cho trạng thái loading
ProjectList.Skeleton = ProjectSkeleton
