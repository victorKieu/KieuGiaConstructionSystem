"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, MoreHorizontal, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PersonnelDialog } from "./personnel-dialog"
import { toast } from "@/components/ui/use-toast"
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
import { Skeleton } from "@/components/ui/skeleton"

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

interface PersonnelListProps {
  personnel: User[]
  isLoading: boolean
  onRefresh: () => void
}

export function PersonnelList({ personnel, isLoading, onRefresh }: PersonnelListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [editUser, setEditUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const filteredPersonnel = personnel.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEdit = (user: User) => {
    setEditUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/personnel/${userToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa nhân viên")
      }

      toast({
        title: "Thành công",
        description: `Đã xóa nhân viên ${userToDelete.name}`,
      })

      onRefresh()
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/personnel/${user.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      })

      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái nhân viên")
      }

      toast({
        title: "Thành công",
        description: `Đã ${!user.isActive ? "kích hoạt" : "vô hiệu hóa"} tài khoản của ${user.name}`,
      })

      onRefresh()
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhân viên:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleEditDialogClose = (refresh = false) => {
    setIsEditDialogOpen(false)
    setEditUser(null)
    if (refresh) {
      onRefresh()
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default"
      case "PROJECT_MANAGER":
        return "outline"
      case "STAFF":
        return "secondary"
      case "ACCOUNTANT":
        return "destructive"
      default:
        return "default"
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-24 ml-auto" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-24 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm nhân viên..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredPersonnel.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email || user.phone || user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.department || "—"}</TableCell>
                    <TableCell>{user.position || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "outline" : "secondary"}>
                        {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                            {user.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Vô hiệu hóa
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <PersonnelDialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose} user={editUser} />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Nhân viên này sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
      </CardContent>
    </Card>
  )
}
