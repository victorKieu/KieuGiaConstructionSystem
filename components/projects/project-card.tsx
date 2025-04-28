import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectProgressCircle } from "@/components/projects/project-progress-circle"
import { Calendar, MapPin, Users, FileText, ListTodo, Layers } from "lucide-react"
import Link from "next/link"

interface Client {
  id: number
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

interface Project {
  id: number
  name: string
  code: string
  client?: Client | null
  clientId?: number | null
  location: string
  status: string
  progress: number
  startDate: string
  expectedEndDate: string
  _count?: {
    tasks: number
    stages: number
    members: number
    documents: number
  }
}

interface ProjectCardProps {
  project: Project
  viewMode?: "grid" | "list"
}

export function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "ON_HOLD":
        return "bg-orange-100 text-orange-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Hàm lấy tên trạng thái
  const getStatusName = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "Chuẩn bị"
      case "IN_PROGRESS":
        return "Đang thực hiện"
      case "COMPLETED":
        return "Hoàn thành"
      case "ON_HOLD":
        return "Tạm dừng"
      case "CANCELLED":
        return "Hủy bỏ"
      default:
        return status
    }
  }

  // Lấy tên khách hàng
  const getClientName = () => {
    if (project.client && typeof project.client === "object" && "name" in project.client) {
      return project.client.name
    }
    return "Chưa có thông tin"
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <Link href={`/dashboard/projects/${project.id}`} className="block">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 md:p-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {project.code}
                  </Badge>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{getClientName()}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Badge className={getStatusColor(project.status)}>{getStatusName(project.status)}</Badge>
                  <div className="w-12 h-12">
                    <ProjectProgressCircle progress={project.progress} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{project.location}</span>
                </div>
                {project._count && (
                  <>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{project._count.stages} giai đoạn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{project._count.tasks} công việc</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/dashboard/projects/${project.id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline">{project.code}</Badge>
            <Badge className={getStatusColor(project.status)}>{getStatusName(project.status)}</Badge>
          </div>
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <CardDescription>{getClientName()}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.location}</span>
              </div>
            </div>
            <div className="w-16 h-16">
              <ProjectProgressCircle progress={project.progress} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            {project._count && (
              <>
                <div className="flex flex-col items-center">
                  <Users className="h-4 w-4 mb-1" />
                  <span>{project._count.members || 0}</span>
                  <span>Thành viên</span>
                </div>
                <div className="flex flex-col items-center">
                  <ListTodo className="h-4 w-4 mb-1" />
                  <span>{project._count.tasks || 0}</span>
                  <span>Công việc</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className="h-4 w-4 mb-1" />
                  <span>{project._count.documents || 0}</span>
                  <span>Tài liệu</span>
                </div>
              </>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
