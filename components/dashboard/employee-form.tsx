"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Employee } from "@/lib/actions/employee-actions"
import { getDepartments, getPositions, getStatuses } from "@/lib/constants/employee-constants"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

// Schema validation
const employeeFormSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(2, {
    message: "Tên nhân viên phải có ít nhất 2 ký tự.",
  }),
  position: z.string({
    required_error: "Vui lòng chọn chức vụ.",
  }),
  department: z.string({
    required_error: "Vui lòng chọn phòng ban.",
  }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email không hợp lệ." }).optional().or(z.literal("")),
  address: z.string().optional(),
  hire_date: z.date({
    required_error: "Vui lòng chọn ngày vào làm.",
  }),
  status: z.string().optional(),
  notes: z.string().optional(),
  avatar_url: z.string().optional(),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

// Chuyển đổi từ dữ liệu Employee sang dạng form
const mapEmployeeToFormValues = (employee: Employee | null): EmployeeFormValues => {
  if (!employee) {
    return {
      code: "",
      name: "",
      position: "",
      department: "",
      phone: "",
      email: "",
      address: "",
      hire_date: new Date(),
      status: "active",
      notes: "",
      avatar_url: "",
    }
  }

  return {
    code: employee.code || "",
    name: employee.name,
    position: employee.position,
    department: employee.department,
    phone: employee.phone || "",
    email: employee.email || "",
    address: employee.address || "",
    hire_date: employee.hire_date ? new Date(employee.hire_date) : new Date(),
    status: employee.status || "active",
    notes: employee.notes || "",
    avatar_url: employee.avatar_url || "",
  }
}

// Component hiển thị nút submit với trạng thái loading
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        "Lưu thông tin"
      )}
    </Button>
  )
}

interface EmployeeFormProps {
  employee?: Employee | null
  action: (formData: FormData) => Promise<void>
}

export function EmployeeForm({ employee, action }: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: mapEmployeeToFormValues(employee),
  })

  const departments = getDepartments()
  const positions = getPositions()
  const statuses = getStatuses()

  // State cho avatar URL
  const [avatarUrl, setAvatarUrl] = useState<string>(employee?.avatar_url || "")

  // Hàm lấy chữ cái đầu của họ và tên
  const getInitials = (name: string): string => {
    if (!name) return "NA"

    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Xử lý khi người dùng nhập URL hình ảnh
  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(e.target.value)
  }

  return (
    <Form {...form}>
      <form action={action} className="space-y-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={employee?.name || "Avatar"} />
            <AvatarFallback className="text-lg">
              {getInitials(employee?.name || form.watch("name") || "NA")}
            </AvatarFallback>
          </Avatar>

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="w-full max-w-md">
                <FormLabel>Hình thẻ nhân viên</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập URL hình ảnh"
                      {...field}
                      name="avatar_url"
                      onChange={(e) => {
                        field.onChange(e)
                        handleAvatarUrlChange(e)
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Nhập URL hình ảnh cho nhân viên. Định dạng khuyến nghị: vuông, tối thiểu 200x200px.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã nhân viên</FormLabel>
                <FormControl>
                  <Input placeholder="VD: EMP001" {...field} name="code" />
                </FormControl>
                <FormDescription>Mã nhân viên dùng để phân biệt nhân viên trong hệ thống.</FormDescription>
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
                  <Input placeholder="Nhập họ và tên nhân viên" {...field} name="name" />
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

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ email" {...field} name="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hire_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày vào làm</FormLabel>
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
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="hire_date" value={field.value ? format(field.value, "yyyy-MM-dd") : ""} />
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập địa chỉ nhân viên" className="resize-none" {...field} name="address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập ghi chú về nhân viên (nếu có)"
                  className="resize-none"
                  {...field}
                  name="notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={employee ? `/dashboard/hrm/employees/${employee.id}` : "/dashboard/hrm/employees"}>Hủy</Link>
          </Button>
          <SubmitButton />
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="id" value={employee?.id || ""} />
      </form>
    </Form>
  )
}
