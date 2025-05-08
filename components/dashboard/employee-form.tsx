"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Định nghĩa schema validation
const employeeSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  position: z.string().min(1, { message: "Vui lòng chọn chức vụ" }),
  department: z.string().min(1, { message: "Vui lòng chọn phòng ban" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  address: z.string().optional(),
  join_date: z.date({ required_error: "Vui lòng chọn ngày vào làm" }),
  status: z.string().optional(),
})

interface EmployeeFormProps {
  employee?: any
  departments: string[]
  positions: string[]
  statuses: string[]
  onSubmit: (formData: FormData) => Promise<void>
}

export function EmployeeForm({ employee, departments, positions, statuses, onSubmit }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Khởi tạo form với giá trị mặc định
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || "",
      position: employee?.position || "",
      department: employee?.department || "",
      phone: employee?.phone || "",
      email: employee?.email || "",
      address: employee?.address || "",
      join_date: employee?.join_date ? new Date(employee.join_date) : undefined,
      status: employee?.status || "Đang làm việc",
    },
  })

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    const result = await form.trigger()
    if (!result) return

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await onSubmit(formData)
      toast({
        title: "Thành công",
        description: employee ? "Đã cập nhật thông tin nhân viên" : "Đã tạo nhân viên mới",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi, vui lòng thử lại",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Họ và tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên" {...field} name="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chức vụ */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Chức vụ <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="position" value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phòng ban */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phòng ban <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="department" value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Số điện thoại */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} name="phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" {...field} name="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày vào làm */}
          <FormField
            control={form.control}
            name="join_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Ngày vào làm <span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="join_date" value={field.value ? format(field.value, "yyyy-MM-dd") : ""} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trạng thái */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="status" value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Địa chỉ */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập địa chỉ" {...field} name="address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={employee ? `/dashboard/hrm/employees/${employee.id}` : "/dashboard/hrm/employees"}>Hủy</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : employee ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

import Link from "next/link"
