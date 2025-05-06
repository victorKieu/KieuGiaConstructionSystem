import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function AttendancePage() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const employees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Kỹ sư xây dựng",
      department: "Kỹ thuật",
      avatar: "/abstract-geometric-shapes.png",
      initials: "NA",
      status: "not_checked",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Chuyên viên kinh doanh",
      department: "Kinh doanh",
      avatar: "/abstract-geometric-tb.png",
      initials: "TB",
      status: "checked_in",
      time: "07:45",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Kế toán",
      department: "Tài chính",
      avatar: "/stylized-lc.png",
      initials: "LC",
      status: "late",
      time: "08:30",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Nhân viên nhân sự",
      department: "Nhân sự",
      avatar: "/public-domain-symbol.png",
      initials: "PD",
      status: "leave",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      position: "Giám đốc dự án",
      department: "Dự án",
      avatar: "/the-element-helium.png",
      initials: "HE",
      status: "absent",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked_in":
        return <Badge className="bg-green-500">Đã chấm công</Badge>
      case "late":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Đi muộn
          </Badge>
        )
      case "leave":
        return <Badge variant="secondary">Nghỉ phép</Badge>
      case "absent":
        return <Badge variant="destructive">Vắng mặt</Badge>
      default:
        return <Badge variant="outline">Chưa chấm công</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "checked_in":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "late":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "leave":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      case "absent":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Chấm công" text={`Ngày: ${today}`} />

      <Card>
        <CardHeader>
          <CardTitle>Chấm công nhân viên</CardTitle>
          <CardDescription>Danh sách nhân viên và trạng thái chấm công hôm nay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                    <AvatarFallback>{employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-right">
                    <p>{employee.department}</p>
                    {employee.time && <p className="text-muted-foreground">{employee.time}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(employee.status)}
                    {getStatusBadge(employee.status)}
                  </div>
                  {employee.status === "not_checked" && <Button size="sm">Chấm công</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Xuất báo cáo</Button>
          <Button>Chấm công tất cả</Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
