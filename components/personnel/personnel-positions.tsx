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

interface Position {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export function PersonnelPositions() {
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const fetchPositions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/positions")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu chức vụ")
      }
      const data = await response.json()
      setPositions(data)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chức vụ:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu chức vụ. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPositions()
  }, [])

  const handleAddPosition = () => {
    setCurrentPosition(null)
    setFormData({
      name: "",
      description: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditPosition = (position: Position) => {
    setCurrentPosition(position)
    setFormData({
      name: position.name,
      description: position.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeletePosition = (position: Position) => {
    setCurrentPosition(position)
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
        description: "Tên chức vụ không được để trống",
        variant: "destructive",
      })
      return
    }

    try {
      const url = currentPosition ? `/api/positions/${currentPosition.id}` : "/api/positions"
      const method = currentPosition ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Không thể lưu thông tin chức vụ")
      }

      toast({
        title: "Thành công",
        description: currentPosition ? "Đã cập nhật thông tin chức vụ" : "Đã thêm chức vụ mới",
      })

      setIsDialogOpen(false)
      fetchPositions()
    } catch (error) {
      console.error("Lỗi khi lưu thông tin chức vụ:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin chức vụ. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = async () => {
    if (!currentPosition) return

    try {
      const response = await fetch(`/api/positions/${currentPosition.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa chức vụ")
      }

      toast({
        title: "Thành công",
        description: `Đã xóa chức vụ ${currentPosition.name}`,
      })

      setIsDeleteDialogOpen(false)
      fetchPositions()
    } catch (error) {
      console.error("Lỗi khi xóa chức vụ:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa chức vụ. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý chức vụ</CardTitle>
          <CardDescription>Quản lý thông tin các chức vụ trong công ty</CardDescription>
        </div>
        <Button onClick={handleAddPosition}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm chức vụ
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chức vụ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Đang tải dữ liệu..." : "Chưa có chức vụ nào"}
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell>{position.description || "—"}</TableCell>
                  <TableCell>{new Date(position.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditPosition(position)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeletePosition(position)}
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
            <DialogTitle>{currentPosition ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}</DialogTitle>
            <DialogDescription>
              {currentPosition ? "Cập nhật thông tin chức vụ" : "Thêm chức vụ mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên chức vụ</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên chức vụ"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả chức vụ"
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
              <Button type="submit">{currentPosition ? "Cập nhật" : "Thêm mới"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chức vụ này sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
