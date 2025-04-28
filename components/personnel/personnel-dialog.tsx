"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

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

interface PersonnelDialogProps {
  open: boolean
  onOpenChange: (refresh?: boolean) => void
  user?: User | null
}

const formSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().optional(),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  role: z.string(),
  department: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

export function PersonnelDialog({ open, onOpenChange, user }: PersonnelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      role: "STAFF",
      department: "",
      position: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        password: "",
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        role: user.role,
        department: user.department || "",
        position: user.position || "",
        isActive: user.isActive,
      })
    } else {
      form.reset({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        role: "STAFF",
        department: "",
        position: "",
        isActive: true,
      })
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const url = isEditing ? `/api/personnel/${user.id}` : "/api/personnel"
      const method = isEditing ? "PUT" : "POST"

      // Nếu đang chỉnh sửa và không nhập mật khẩu mới, loại bỏ trường password
      if (isEditing && !values.password) {
        delete values.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Không thể lưu thông tin nhân viên")
      }

      toast({
        title: "Thành công",
        description: isEditing ? "Đã cập nhật thông tin nhân viên" : "Đã thêm nhân viên mới",
      })

      onOpenChange(true)
    } catch (error) {
      console.error("Lỗi khi lưu thông tin nhân viên:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin nhân viên trong hệ thống" : "Thêm nhân viên mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đăng nhập" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEditing ? "Nhập mật khẩu mới" : "Nhập mật khẩu"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                      <SelectItem value="PROJECT_MANAGER">Quản lý dự án</SelectItem>
                      <SelectItem value="STAFF">Nhân viên</SelectItem>
                      <SelectItem value="ACCOUNTANT">Kế toán</SelectItem>
                      <SelectItem value="ENGINEER">Kỹ sư</SelectItem>
                      <SelectItem value="WORKER">Công nhân</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng ban</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập phòng ban" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập chức vụ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Trạng thái hoạt động</FormLabel>
                    <p className="text-sm text-muted-foreground">Nhân viên có thể đăng nhập và sử dụng hệ thống</p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange()}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
