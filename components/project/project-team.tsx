"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Edit, Plus, Trash, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ProjectTeamProps {
  projectId: string
}

export default function ProjectTeam({ projectId }: ProjectTeamProps) {
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const teamMembers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Quản lý dự án",
      department: "Ban quản lý dự án",
      startDate: "2023-01-01",
      endDate: null,
      status: "Đang làm việc",
      phone: "0901234567",
      email: "nguyenvana@example.com",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Kỹ sư giám sát",
      department: "Phòng kỹ thuật",
      startDate: "2023-01-15",
      endDate: null,
      status: "Đang làm việc",
      phone: "0901234568",
      email: "tranthib@example.com",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Kỹ sư thiết kế",
      department: "Phòng thiết kế",
      startDate: "2023-01-15",
      endDate: "2023-03-15",
      status: "Đã hoàn thành",
      phone: "0901234569",
      email: "levanc@example.com",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Kế toán dự án",
      department: "Phòng tài chính",
      startDate: "2023-01-15",
      endDate: null,
      status: "Đang làm việc",
      phone: "0901234570",
      email: "phamthid@example.com",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang làm việc":
        return "bg-green-100 text-green-800"
      case "Đã hoàn thành":
        return "bg-blue-100 text-blue-800"
      case "Tạm nghỉ":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddMember = () => {
    // Xử lý thêm thành viên mới
    setIsAddingMember(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nhân sự dự án</CardTitle>
          <CardDescription>Quản lý nhân sự tham gia dự án</CardDescription>
        </div>
        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân sự
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm nhân sự mới</DialogTitle>
              <DialogDescription>Thêm nhân sự mới vào dự án</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="member" className="text-right">
                  Nhân viên
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nguyễn Văn X</SelectItem>
                    <SelectItem value="2">Trần Thị Y</SelectItem>
                    <SelectItem value="3">Lê Văn Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Input id="role" placeholder="Nhập vai trò" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Ngày bắt đầu
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  Ngày kết thúc
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>Chọn ngày (không bắt buộc)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddMember}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-2">{member.name}</div>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  {new Date(member.startDate).toLocaleDateString("vi-VN")}
                  {member.endDate && ` - ${new Date(member.endDate).toLocaleDateString("vi-VN")}`}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{member.phone}</div>
                    <div className="text-gray-500">{member.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
