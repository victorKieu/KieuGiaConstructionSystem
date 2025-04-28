"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Edit, Trash2, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserType {
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

interface Project {
  id: number
  code: string
  name: string
}

interface Assignment {
  id: number
  projectId: number
  userId: number
  role: string
  startDate: string
  endDate?: string
  project: Project
  user: UserType
}

interface PersonnelAssignmentsProps {
  personnel: UserType[]
}

export function PersonnelAssignments({ personnel }: PersonnelAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState({
    projectId: "",
    userId: "",
    role: "",
    startDate: "",
    endDate: "",
  })

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/project-members")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu phân công")
      }
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phân công:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu phân công. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu dự án")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dự án:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu dự án. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAssignments()
    fetchProjects()
  }, [])

  const handleAddAssignment = () => {
    setCurrentAssignment(null)
    setFormData({
      projectId: "",
      userId: "",
      role: "MEMBER",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setCurrentAssignment(assignment)
    setFormData({
      projectId: assignment.projectId.toString(),
      userId: assignment.userId.toString(),
      role: assignment.role,
      startDate: new Date(assignment.startDate).toISOString().split("T")[0],
      endDate: assignment.endDate ? new Date(assignment.endDate).toISOString().split("T")[0] : "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteAssignment = (assignment: Assignment) => {
    setCurrentAssignment(assignment)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.projectId || !formData.userId || !formData.role || !formData.startDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    try {
      const url = currentAssignment ? `/api/project-members/${currentAssignment.id}` : "/api/project-members"
      const method = currentAssignment ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: Number.parseInt(formData.projectId),
          userId: Number.parseInt(formData.userId),
          role: formData.role,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Không thể lưu thông tin phân công")
      }

      toast({
        title: "Thành công",
        description: currentAssignment ? "Đã cập nhật thông tin phân công" : "Đã thêm phân công mới",
      })

      setIsDialogOpen(false)
      fetchAssignments()
    } catch (error) {
      console.error("Lỗi khi lưu thông tin phân công:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin phân công. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = async () => {
    if (!currentAssignment) return

    try {
      const response = await fetch(`/api/project-members/${currentAssignment.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa phân công")
      }

      toast({
        title: "Thành công",
        description: "Đã xóa phân công thành công",
      })

      setIsDeleteDialogOpen(false)
      fetchAssignments()
    } catch (error) {
      console.error("Lỗi khi xóa phân công:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa phân công. Vui lòng thử lại sau.",
        variant: "destructive",
      })
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Phân công nhân sự</CardTitle>
          <CardDescription>Quản lý phân công nhân sự cho các dự án</CardDescription>
        </div>
        <Button onClick={handleAddAssignment}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm phân công
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dự án</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Đang tải dữ liệu..." : "Chưa có phân công nào"}
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="font-medium">{assignment.project.name}</div>
                    <div className="text-sm text-muted-foreground">{assignment.project.code}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={assignment.user.avatar || "/placeholder.svg"} alt={assignment.user.name} />
                        <AvatarFallback>{getInitials(assignment.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignment.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.user.position || assignment.user.role}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{assignment.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(assignment.startDate).toLocaleDateString("vi-VN")}
                        {assignment.endDate
                          ? ` - ${new Date(assignment.endDate).toLocaleDateString("vi-VN")}`
                          : " - Hiện tại"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditAssignment(assignment)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteAssignment(assignment)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentAssignment ? "Chỉnh sửa phân công" : "Thêm phân công mới"}</DialogTitle>
            <DialogDescription>
              {currentAssignment ? "Cập nhật thông tin phân công nhân sự" : "Thêm phân công nhân sự mới cho dự án"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="projectId">Dự án</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => handleSelectChange("projectId", value)}
                  disabled={!!currentAssignment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name} ({project.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">Nhân viên</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => handleSelectChange("userId", value)}
                  disabled={!!currentAssignment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {personnel
                      .filter((user) => user.isActive)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.position || user.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò trong dự án</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROJECT_MANAGER">Quản lý dự án</SelectItem>
                    <SelectItem value="ENGINEER">Kỹ sư</SelectItem>
                    <SelectItem value="ACCOUNTANT">Kế toán</SelectItem>
                    <SelectItem value="WORKER">Công nhân</SelectItem>
                    <SelectItem value="MEMBER">Thành viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc (nếu có)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">{currentAssignment ? "Cập nhật" : "Thêm mới"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Phân công này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
