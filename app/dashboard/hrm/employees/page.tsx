import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Quản lý nhân viên | Kieu Gia Construction",
  description: "Quản lý thông tin nhân viên",
}

export default function EmployeesPage() {
  // Dữ liệu mẫu nhân viên
  const employees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Kỹ sư xây dựng",
      department: "Kỹ thuật",
      joinDate: "15/04/2023",
      status: "Đang làm việc",
      avatar: "/abstract-geometric-shapes.png",
      initials: "NA",
      email: "nguyenvana@kieugia.com",
      phone: "0901234567",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Chuyên viên kinh doanh",
      department: "Kinh doanh",
      joinDate: "20/04/2023",
      status: "Đang làm việc",
      avatar: "/abstract-geometric-tb.png",
      initials: "TB",
      email: "tranthib@kieugia.com",
      phone: "0901234568",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Kế toán",
      department: "Tài chính",
      joinDate: "22/04/2023",
      status: "Đang làm việc",
      avatar: "/stylized-lc.png",
      initials: "LC",
      email: "levanc@kieugia.com",
      phone: "0901234569",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Nhân viên nhân sự",
      department: "Nhân sự",
      joinDate: "25/04/2023",
      status: "Thử việc",
      avatar: "/public-domain-symbol.png",
      initials: "PD",
      email: "phamthid@kieugia.com",
      phone: "0901234570",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      position: "Giám đốc dự án",
      department: "Dự án",
      joinDate: "10/01/2023",
      status: "Đang làm việc",
      avatar: "/the-element-helium.png",
      initials: "HE",
      email: "hoangvane@kieugia.com",
      phone: "0901234571",
    },
    {
      id: 6,
      name: "Ngô Thị F",
      position: "Kỹ sư xây dựng",
      department: "Kỹ thuật",
      joinDate: "05/02/2023",
      status: "Đang làm việc",
      avatar: "/abstract-geometric-shapes.png",
      initials: "NF",
      email: "ngothif@kieugia.com",
      phone: "0901234572",
    },
    {
      id: 7,
      name: "Đỗ Văn G",
      position: "Chuyên viên kinh doanh",
      department: "Kinh doanh",
      joinDate: "15/03/2023",
      status: "Đang làm việc",
      avatar: "/abstract-dg.png",
      initials: "DG",
      email: "dovang@kieugia.com",
      phone: "0901234573",
    },
    {
      id: 8,
      name: "Lý Thị H",
      position: "Kế toán",
      department: "Tài chính",
      joinDate: "20/05/2023",
      status: "Thử việc",
      avatar: "/abstract-geometric-lh.png",
      initials: "LH",
      email: "lythih@kieugia.com",
      phone: "0901234574",
    },
  ]

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Quản lý nhân viên</h1>
          <p className="text-muted-foreground">Quản lý thông tin và hồ sơ nhân viên</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm nhân viên..." className="w-full pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Lọc
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>Tổng số: {employees.length} nhân viên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center gap-4 p-3 hover:bg-muted rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                  <AvatarFallback>{employee.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">{employee.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{employee.position}</p>
                </div>
                <div className="hidden md:block text-sm">
                  <p>{employee.department}</p>
                </div>
                <div className="hidden md:block text-sm">
                  <p>{employee.email}</p>
                </div>
                <div className="hidden md:block text-sm">
                  <p>{employee.phone}</p>
                </div>
                <Badge variant={employee.status === "Thử việc" ? "outline" : "default"}>{employee.status}</Badge>
                <Button variant="ghost" size="sm">
                  <Link href={`/dashboard/hrm/employees/${employee.id}`}>Chi tiết</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
