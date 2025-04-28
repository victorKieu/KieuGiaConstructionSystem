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
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Edit, Plus, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ProjectStagesProps {
  projectId: string
}

export default function ProjectStages({ projectId }: ProjectStagesProps) {
  const [isAddingStage, setIsAddingStage] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const stages = [
    {
      id: 1,
      name: "Móng",
      description: "Thi công phần móng",
      startDate: "2023-01-15",
      endDate: "2023-03-15",
      status: "Hoàn thành",
      completionPercentage: 100,
    },
    {
      id: 2,
      name: "Thô",
      description: "Thi công phần thô",
      startDate: "2023-03-16",
      endDate: "2023-08-15",
      status: "Đang thi công",
      completionPercentage: 75,
    },
    {
      id: 3,
      name: "Hoàn thiện",
      description: "Thi công hoàn thiện",
      startDate: "2023-08-16",
      endDate: "2024-03-15",
      status: "Chưa bắt đầu",
      completionPercentage: 0,
    },
    {
      id: 4,
      name: "Bàn giao",
      description: "Bàn giao công trình",
      startDate: "2024-03-16",
      endDate: "2024-06-30",
      status: "Chưa bắt đầu",
      completionPercentage: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800"
      case "Đang thi công":
        return "bg-blue-100 text-blue-800"
      case "Chưa bắt đầu":
        return "bg-gray-100 text-gray-800"
      case "Tạm dừng":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddStage = () => {
    // Xử lý thêm giai đoạn mới
    setIsAddingStage(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Giai đoạn dự án</CardTitle>
          <CardDescription>Quản lý các giai đoạn của dự án</CardDescription>
        </div>
        <Dialog open={isAddingStage} onOpenChange={setIsAddingStage}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm giai đoạn
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm giai đoạn mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho giai đoạn mới của dự án</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên giai đoạn
                </Label>
                <Input id="name" placeholder="Nhập tên giai đoạn" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea id="description" placeholder="Nhập mô tả giai đoạn" className="col-span-3" />
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
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
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
              <Button variant="outline" onClick={() => setIsAddingStage(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddStage}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên giai đoạn</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((stage) => (
              <TableRow key={stage.id}>
                <TableCell className="font-medium">{stage.name}</TableCell>
                <TableCell>{stage.description}</TableCell>
                <TableCell>
                  {new Date(stage.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(stage.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(stage.status)}>{stage.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${stage.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{stage.completionPercentage}%</span>
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
