import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ProjectWarrantyProps {
  projectId: string
}

export default function ProjectWarranty({ projectId }: ProjectWarrantyProps) {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const warrantyItems = [
    {
      id: 1,
      item: "Hệ thống điện",
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      duration: "24 tháng",
      status: "active",
      notes: "Kiểm tra định kỳ 6 tháng/lần",
    },
    {
      id: 2,
      item: "Hệ thống nước",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      duration: "12 tháng",
      status: "active",
      notes: "Kiểm tra định kỳ 3 tháng/lần",
    },
    {
      id: 3,
      item: "Kết cấu công trình",
      startDate: "2024-01-15",
      endDate: "2029-01-15",
      duration: "60 tháng",
      status: "active",
      notes: "Kiểm tra định kỳ 12 tháng/lần",
    },
    {
      id: 4,
      item: "Hệ thống PCCC",
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      duration: "24 tháng",
      status: "active",
      notes: "Kiểm tra định kỳ 3 tháng/lần",
    },
  ]

  // Lịch kiểm tra bảo hành
  const warrantyChecks = [
    {
      id: 1,
      item: "Hệ thống điện",
      scheduledDate: "2024-07-15",
      status: "scheduled",
      assignedTo: "Nguyễn Văn A",
    },
    {
      id: 2,
      item: "Hệ thống nước",
      scheduledDate: "2024-04-15",
      status: "completed",
      assignedTo: "Trần Văn B",
      completedDate: "2024-04-16",
      notes: "Đã kiểm tra và thay thế van áp suất",
    },
    {
      id: 3,
      item: "Hệ thống PCCC",
      scheduledDate: "2024-04-15",
      status: "scheduled",
      assignedTo: "Lê Văn C",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang bảo hành</Badge>
      case "expired":
        return <Badge variant="destructive">Hết hạn</Badge>
      case "scheduled":
        return <Badge variant="outline">Đã lên lịch</Badge>
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bảo hành</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hạng mục</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warrantyItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch kiểm tra bảo hành</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hạng mục</TableHead>
                <TableHead>Ngày kiểm tra</TableHead>
                <TableHead>Người phụ trách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warrantyChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="font-medium">{check.item}</TableCell>
                  <TableCell>{check.scheduledDate}</TableCell>
                  <TableCell>{check.assignedTo}</TableCell>
                  <TableCell>{getStatusBadge(check.status)}</TableCell>
                  <TableCell>{check.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
