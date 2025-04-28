"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { createProject } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Schema cho form dự án
const formSchema = z
  .object({
    name: z.string().min(3, { message: "Tên dự án phải có ít nhất 3 ký tự" }),
    code: z.string().min(2, { message: "Mã dự án phải có ít nhất 2 ký tự" }),
    customer: z.string().min(2, { message: "Tên khách hàng phải có ít nhất 2 ký tự" }),
    startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
    endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
    description: z.string().optional(),
    budget: z.string().min(1, { message: "Vui lòng nhập ngân sách" }),
    status: z.string({ required_error: "Vui lòng chọn trạng thái" }),
    manager: z.string().min(2, { message: "Tên quản lý phải có ít nhất 2 ký tự" }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  })

export default function ProjectForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Khởi tạo form với react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      customer: "",
      description: "",
      budget: "",
      status: "planning",
      manager: "",
    },
  })

  // Xử lý khi submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setError(null)
      console.log("Submitting form with values:", values)

      // Gọi server action
      const result = await createProject(values)
      console.log("Server action result:", result)

      if (result.success) {
        toast({
          title: "Tạo dự án thành công",
          description: "Dự án mới đã được tạo thành công",
        })
        router.push("/dashboard/projects")
      } else {
        setError(result.error || "Đã xảy ra lỗi khi tạo dự án")

        // Nếu lỗi liên quan đến mã dự án, focus vào trường đó
        if (result.error?.includes("Mã dự án")) {
          form.setError("code", {
            type: "manual",
            message: "Mã dự án đã tồn tại",
          })
          form.setFocus("code")
        }

        toast({
          title: "Lỗi",
          description: result.error || "Đã xảy ra lỗi khi tạo dự án",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(String(error))
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo dự án",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format số tiền khi nhập
  function formatCurrency(value: string) {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, "")
    // Format với dấu phân cách hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên dự án */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên dự án</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên dự án" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mã dự án */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã dự án</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập mã dự án" {...field} />
                </FormControl>
                <FormDescription>Mã dự án phải là duy nhất trong hệ thống</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Khách hàng */}
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khách hàng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên khách hàng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quản lý dự án */}
          <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quản lý dự án</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên quản lý dự án" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày bắt đầu */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày kết thúc */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày kết thúc</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngân sách */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngân sách (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập ngân sách"
                    {...field}
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      field.onChange(formattedValue)
                    }}
                  />
                </FormControl>
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
                    <SelectItem value="planning">Lập kế hoạch</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="on_hold">Tạm dừng</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mô tả */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả dự án" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Mô tả chi tiết về dự án, mục tiêu và phạm vi công việc.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/projects")}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Tạo dự án"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
