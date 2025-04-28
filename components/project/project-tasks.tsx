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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Edit, Plus, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ProjectTasksProps {
  projectId: string
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()

  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const tasks = [
    {
      id: 1,
      name: "Khảo sát địa chất",
      description: "Khảo sát và lấy mẫu địa chất tại công trường",
      stage: "Móng",
      assignedTo: "Nguyễn Văn B",
      startDate: "2023-01-15",
      dueDate: "2023-01-25",
      status: "Hoàn thành",
      priority: "Cao",
      completionPercentage: 100,
    },
    {
      id: 2,
      name: "Thiết kế móng",
      description: "Thiết kế chi tiết phần móng công trình",
      stage: "Móng",
      assignedTo: "Trần Thị C",
      startDate: "2023-01-26",
      dueDate: "2023-02-10",
      status: "Hoàn thành",
      priority: "Cao",
      completionPercentage: 100,
    },
    {
      id: 3,
      name: "Thi công cốt thép sàn tầng 1",
      description: "Thi công phần cốt thép sàn tầng 1",
      stage: "Thô",
      assignedTo: "Lê Văn D",
      startDate: "2023-03-20",
      dueDate: "2023-04-05",
      status: "Đang thực hiện",
      priority: "Trung bình",
      completionPercentage: 75,
    },
    {
      id: 4,
      name: "Đổ bê tông sàn tầng 1",
      description: "Đổ bê tông sàn tầng 1",
      stage: "Thô",
      assignedTo: "Phạm Văn E",
      startDate: "2023-04-06",
      dueDate: "2023-04-15",
      status: "Chưa bắt đầu",
      priority: "Cao",
      completionPercentage: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800"
      case "Đang thực hiện":
        return "bg-blue-100 text-blue-800"
      case "Chưa bắt đầu":
        return "bg-gray-100 text-gray-800"
      case "Tạm dừng":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao":
        return "bg-red-100 text-red-800"
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800"
      case "Thấp":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddTask = () => {
    // Xử lý thêm công việc mới
    setIsAddingTask(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Công việc dự án</CardTitle>
          <CardDescription>Quản lý các công việc của dự án</CardDescription>
        </div>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm công việc
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm công việc mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết cho công việc mới của dự án</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên công việc
                </Label>
                <Input id="name" placeholder="Nhập tên công việc" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea id="description" placeholder="Nhập mô tả công việc" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage" className="text-right">
                  Giai đoạn
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn giai đoạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Móng</SelectItem>
                    <SelectItem value="2">Thô</SelectItem>
                    <SelectItem value="3">Hoàn thiện</SelectItem>
                    <SelectItem value="4">Bàn giao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">
                  Người thực hiện
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nguyễn Văn B</SelectItem>
                    <SelectItem value="2">Trần Thị C</SelectItem>
                    <SelectItem value="3">Lê Văn D</SelectItem>
                    <SelectItem value="4">Phạm Văn E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Độ ưu tiên
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="dueDate" className="text-right">
                  Ngày hạn chót
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddTask}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên công việc</TableHead>
              <TableHead>Giai đoạn</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ưu tiên</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{task.name}</div>
                    <div className="text-xs text-gray-500">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell>{task.stage}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  {new Date(task.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${task.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{task.completionPercentage}%</span>
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
