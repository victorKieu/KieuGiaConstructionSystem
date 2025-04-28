import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

const projects = [
  {
    id: "PRJ001",
    name: "Chung cư ABC",
    client: "Công ty ABC",
    status: "Đang thi công",
    progress: 75,
    deadline: "30/12/2023",
  },
  {
    id: "PRJ002",
    name: "Biệt thự XYZ",
    client: "Ông Nguyễn Văn A",
    status: "Đang thi công",
    progress: 45,
    deadline: "15/01/2024",
  },
  {
    id: "PRJ003",
    name: "Nhà máy DEF",
    client: "Tập đoàn DEF",
    status: "Chuẩn bị",
    progress: 10,
    deadline: "01/03/2024",
  },
  {
    id: "PRJ004",
    name: "Trung tâm thương mại GHI",
    client: "Công ty GHI",
    status: "Hoàn thành",
    progress: 100,
    deadline: "15/11/2023",
  },
  {
    id: "PRJ005",
    name: "Khu dân cư JKL",
    client: "Tập đoàn JKL",
    status: "Tạm dừng",
    progress: 60,
    deadline: "30/04/2024",
  },
]

export default function ProjectsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã dự án</TableHead>
          <TableHead>Tên dự án</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Tiến độ</TableHead>
          <TableHead>Hạn hoàn thành</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.id}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.client}</TableCell>
            <TableCell>
              <Badge
                variant={
                  project.status === "Đang thi công"
                    ? "default"
                    : project.status === "Hoàn thành"
                      ? "success"
                      : project.status === "Tạm dừng"
                        ? "destructive"
                        : "outline"
                }
              >
                {project.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-xs">{project.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{project.deadline}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Tùy chọn</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
