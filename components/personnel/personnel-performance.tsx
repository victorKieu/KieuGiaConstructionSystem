"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"

interface User {
  id: number
  username: string
  name: string
  email?: string
  phone?: string
  role: string
  department?: string
  position?: string
  avatar?: string
  isActive: boolean
}

interface Task {
  id: number
  name: string
  status: string
  priority: string
  completionPercentage: number
  dueDate: string
}

interface UserPerformance {
  userId: number
  user: User
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  lateTasks: number
  completionRate: number
  tasks: Task[]
}

interface PersonnelPerformanceProps {
  personnel: User[]
}

export function PersonnelPerformance({ personnel }: PersonnelPerformanceProps) {
  const [performanceData, setPerformanceData] = useState<UserPerformance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedUser, setExpandedUser] = useState<number | null>(null)

  const fetchPerformanceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/personnel/performance")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu hiệu suất")
      }
      const data = await response.json()
      setPerformanceData(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hiệu suất:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu hiệu suất. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const toggleExpandUser = (userId: number) => {
    if (expandedUser === userId) {
      setExpandedUser(null)
    } else {
      setExpandedUser(userId)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "PAUSED":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "NOT_STARTED":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="destructive">Cao</Badge>
      case "MEDIUM":
        return <Badge variant="default">Trung bình</Badge>
      case "LOW":
        return <Badge variant="outline">Thấp</Badge>
      default:
        return null
    }
  }

  const isTaskLate = (task: Task) => {
    return task.status !== "COMPLETED" && new Date(task.dueDate) < new Date()
  }

  // Tạo dữ liệu mẫu nếu API chưa có
  useEffect(() => {
    if (personnel.length > 0 && performanceData.length === 0 && !isLoading) {
      const sampleData: UserPerformance[] = personnel.map((user) => {
        const totalTasks = Math.floor(Math.random() * 20) + 5
        const completedTasks = Math.floor(Math.random() * totalTasks)
        const pendingTasks = Math.floor(Math.random() * (totalTasks - completedTasks))
        const lateTasks = totalTasks - completedTasks - pendingTasks

        const tasks: Task[] = Array.from({ length: totalTasks }).map((_, index) => {
          const statuses = ["COMPLETED", "IN_PROGRESS", "PAUSED", "NOT_STARTED"]
          const priorities = ["HIGH", "MEDIUM", "LOW"]
          const status = statuses[Math.floor(Math.random() * statuses.length)]

          return {
            id: index + 1,
            name: `Công việc ${index + 1} của ${user.name}`,
            status,
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            completionPercentage: status === "COMPLETED" ? 100 : Math.floor(Math.random() * 100),
            dueDate: new Date(Date.now() + (Math.random() * 30 - 15) * 24 * 60 * 60 * 1000).toISOString(),
          }
        })

        return {
          userId: user.id,
          user,
          totalTasks,
          completedTasks,
          pendingTasks,
          lateTasks,
          completionRate: (completedTasks / totalTasks) * 100,
          tasks,
        }
      })

      setPerformanceData(sampleData)
    }
  }, [personnel, performanceData, isLoading])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất nhân viên</CardTitle>
        <CardDescription>Theo dõi hiệu suất làm việc của nhân viên</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Tổng công việc</TableHead>
              <TableHead>Hoàn thành</TableHead>
              <TableHead>Đang thực hiện</TableHead>
              <TableHead>Trễ hạn</TableHead>
              <TableHead>Tỷ lệ hoàn thành</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu hiệu suất"}
                </TableCell>
              </TableRow>
            ) : (
              performanceData.map((data) => (
                <>
                  <TableRow
                    key={data.userId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpandUser(data.userId)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                          <AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{data.user.name}</div>
                          <div className="text-sm text-muted-foreground">{data.user.position || data.user.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{data.totalTasks}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {data.completedTasks}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {data.pendingTasks}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        {data.lateTasks}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full flex items-center gap-2">
                        <Progress value={data.completionRate} className="h-2 w-full" />
                        <span className="text-sm font-medium">{Math.round(data.completionRate)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedUser === data.userId && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <h4 className="text-sm font-medium mb-2">Danh sách công việc</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tên công việc</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Độ ưu tiên</TableHead>
                                <TableHead>Tiến độ</TableHead>
                                <TableHead>Hạn hoàn thành</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.tasks.map((task) => (
                                <TableRow key={task.id} className={isTaskLate(task) ? "bg-red-50" : ""}>
                                  <TableCell>{task.name}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(task.status)}
                                      <span>
                                        {task.status === "COMPLETED"
                                          ? "Hoàn thành"
                                          : task.status === "IN_PROGRESS"
                                            ? "Đang thực hiện"
                                            : task.status === "PAUSED"
                                              ? "Tạm dừng"
                                              : "Chưa bắt đầu"}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                  <TableCell>
                                    <div className="w-full flex items-center gap-2">
                                      <Progress value={task.completionPercentage} className="h-2 w-full" />
                                      <span className="text-sm font-medium">{task.completionPercentage}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div
                                      className={`flex items-center gap-2 ${isTaskLate(task) ? "text-red-500" : ""}`}
                                    >
                                      <Clock className="h-4 w-4" />
                                      <span>{new Date(task.dueDate).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
