"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
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

interface Department {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export function PersonnelDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const fetchDepartments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/departments")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu phòng ban")
      }
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu phòng ban. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleAddDepartment = () => {
    setCurrentDepartment(null)
    setFormData({
      name: "",
      description: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteDepartment = (department: Department) => {
    setCurrentDepartment(department)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên phòng ban không được để trống",
        variant: "destructive",
      })
      return
    }

    try {
      const url = currentDepartment ? `/api/departments/${currentDepartment.id}` : "/api/departments"
      const method = currentDepartment ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Không thể lưu thông tin phòng ban")
      }

      toast({
        title: "Thành công",
        description: currentDepartment ? "Đã cập nhật thông tin phòng ban" : "Đã thêm phòng ban mới",
      })

      setIsDialogOpen(false)
      fetchDepartments()
    } catch (error) {
      console.error("Lỗi khi lưu thông tin phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin phòng ban. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = async () => {
    if (!currentDepartment) return

    try {
      const response = await fetch(`/api/departments/${currentDepartment.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa phòng ban")
      }

      toast({
        title: "Thành công",
        description: `Đã xóa phòng ban ${currentDepartment.name}`,
      })

      setIsDeleteDialogOpen(false)
      fetchDepartments()
    } catch (error) {
      console.error("Lỗi khi xóa phòng ban:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa phòng ban. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý phòng ban</CardTitle>
          <CardDescription>Quản lý thông tin các phòng ban trong công ty</CardDescription>
        </div>
        <Button onClick={handleAddDepartment}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm phòng ban
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên phòng ban</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Đang tải dữ liệu..." : "Chưa có phòng ban nào"}
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description || "—"}</TableCell>
                  <TableCell>{new Date(department.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditDepartment(department)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteDepartment(department)}
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
            <DialogTitle>{currentDepartment ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}</DialogTitle>
            <DialogDescription>
              {currentDepartment ? "Cập nhật thông tin phòng ban" : "Thêm phòng ban mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên phòng ban</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên phòng ban"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả phòng ban"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">{currentDepartment ? "Cập nhật" : "Thêm mới"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Phòng ban này sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
